import { defineStore } from "pinia";
import router from "@/router";
import firebase from "firebase/compat/app";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { db, functions } from "@/main";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import "firebase/compat/auth";
import { useBlogPost } from "./BlogPost";

interface Blog {
  id: string;
  blogTitle: string;
  blogAuthor: string;
  blogContent: string;
  imgURL: string;
  date: string;
}
interface comment {
  displayName: string;
  body: string;
  date: number;
  replies: comment[];
}
interface comments {
  comments: Array<comment>;
}

export const useFireBase = defineStore("FireBase", {
  state: () => ({
    getDataError: "",
    loadingData: true as boolean,
    comments: [{}],
    numComments: 0,
    admin: false as boolean,
    user: null as User | null,
    viewCreate: true,
    displayName: "" as any,
    commentImg: "" as string | null,
    showSignInForm: true as boolean,
    loggedIn: false,
    loginReq: false as boolean,
    signInValid: true as boolean,
    signUpValid: true as boolean,
    signUpReq: false as boolean,
    errorMsg: "" as string,
    createBlog: true as boolean,
  }),

  actions: {
    goToEdit() {
      this.viewCreate = false;
      this.createBlog = false;
      router.push("createBlog");
    },
    toggleForm() {
      this.showSignInForm = !this.showSignInForm;
      this.errorMsg = "";
    },
    async logOut() {
      const auth = getAuth();
      firebase.auth().useDeviceLanguage();
      try {
        await signOut(auth);
        router.push("/");
      } catch (error: any) {
        if (error.code === "auth/network-request-failed") {
          this.errorMsg =
            "There was a problem with the network. Please try again later.";
        } else {
          this.errorMsg = "Something Wrong, try again!";
        }
      }
    },
    async signUp(
      firstName: string,
      lastName: string,
      signUpEmail: string,
      signUpPassword: string
    ) {
      this.signUpReq = true;
      try {
        const cred = await firebase
          .auth()
          .createUserWithEmailAndPassword(signUpEmail, signUpPassword);
        const user = cred.user;
        await user?.updateProfile({
          displayName: `${firstName} ${lastName}`,
        });
        await user?.sendEmailVerification();

        const addAdminRole = functions.httpsCallable("addAdminRole");
        try {
          const res = await addAdminRole({ email: signUpEmail });
        } catch (error: any) {
          console.log(error.message);
        }

        await router.push("/");
        this.signUpReq = false;
      } catch (error: any) {
        this.signUpReq = false;
        this.signUpValid = false;
        switch (error.code) {
          case "auth/email-already-in-use":
            this.errorMsg = "Email already in use";
            break;
          case "auth/invalid-email":
            this.errorMsg = "Invalid email";
            break;
          case "auth/weak-password":
            this.errorMsg = "Weak password";
            break;
          default:
            this.errorMsg = "Something Wrong, try again!";
            break;
        }
      }
    },

    async signin(signInEmail: string, signInPassword: string) {
      this.loginReq = true;
      try {
        const auth = getAuth();
        const data = await signInWithEmailAndPassword(
          auth,
          signInEmail,
          signInPassword
        );
        this.loginReq = false;
        this.signInValid = true;

        router.push("/");
      } catch (error: any) {
        this.loginReq = false;
        this.signInValid = false;
        switch (error.code) {
          case "auth/invalid-email":
            this.errorMsg = "Invalid email";
            break;
          case "auth/user-not-found":
            this.errorMsg = "No account with that email was found";
            break;
          case "auth/wrong-password":
            this.errorMsg = "Incorrect password";
            break;
          default:
            this.errorMsg = "Something Wrong, try again!";
            break;
        }
      }
    },

    async singInWithGoogle(email: string, password: string) {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      firebase.auth().useDeviceLanguage();
      try {
        const result = await signInWithPopup(auth, provider);
        router.push("/");
      } catch (error: any) {
        switch (error.code) {
          case "auth/account-exists-with-different-credential":
            this.errorMsg =
              "This Google account is already linked to another account. Please sign in with the other account or use a different Google account.";
            break;
          case "auth/popup-blocked":
            this.errorMsg =
              "Please enable popups for this website to sign in with Google.";
            break;
          default:
            this.errorMsg = "Something Wrong, try again!";
            break;
        }
      }
    },
    async getToken() {
      const user = getAuth().currentUser;

      const idTokenResult = await user?.getIdTokenResult(true);
      const admin = await idTokenResult?.claims.admin;

      this.admin = admin;
    },

    async authChange() {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        await this.getToken();

        if (user) {
          this.displayName = user.displayName;
          this.user = user;
          this.loggedIn = true;
        } else {
          this.user = null;
          this.loggedIn = false;
        }
      });
    },

    async getData() {
      this.loadingData = true;
      this.getDataError = "";
      useBlogPost().Blogs = [];
      try {
        const querySnapshot = await getDocs(collection(db, "Blogs"));
        querySnapshot.forEach((doc) => {
          const blog = {
            id: doc.id as string,
            blogTitle: doc.data().blogTitle as string,
            blogAuthor: doc.data().blogAuthor as string,
            blogContent: doc.data().blogContent as string,
            imgURL: doc.data().imgURL as string,
            date: doc.data().date as string,
          };
          useBlogPost().Blogs.push(blog);
        });
      } catch (error: any) {
        console.log(error.code);
        this.getDataError = error.code;
      }

      useBlogPost().resizeVar();
      this.loadingData = false;
    },

    async getBlog(id: string) {
      const querySnapshot = await getDocs(collection(db, "Blogs"));
      querySnapshot.forEach((doc) => {
        if (doc.id === id) {
          const blog = {
            id: doc.id,
            blogTitle: doc.data().blogTitle,
            blogAuthor: doc.data().blogAuthor,
            blogContent: doc.data().blogContent,
            imgURL: doc.data().imgURL,
            date: doc.data().date,
          };
          useBlogPost().viewBlog = blog;
          this.getComment(blog.id);
          /* router.push(`viewBlog/${blog.id}`); */
        }
      });
    },

    async getComment(id: string) {
      const querySnapshot = await getDocs(collection(db, "Comments"));
      let comment = [] as comment[];
      querySnapshot.forEach((doc) => {
        if (doc.id === id) {
          comment = doc.data() as comment[];
        }
      });
      this.comments = Object.values(comment);
    },

    async createForm(
      addTitle: string,
      addContent: string,
      addImgURL: string,
      create: boolean
    ) {
      if (addContent.split(" ").length < 50) {
        this.errorMsg = "blog content must be at least 50 words";
        return;
      }
      if (create) {
        const blogDate = new Date().toDateString().substring(4);
        const author = getAuth().currentUser?.displayName;
        const addBlog = {
          blogTitle: addTitle,
          blogAuthor: author,
          blogContent: addContent,
          imgURL: addImgURL,
          date: blogDate,
        };

        await addDoc(collection(db, "Blogs"), addBlog);
        router.push("/");
      } else {
        this.editBlog(
          addTitle,
          addContent,
          addImgURL,
          useBlogPost().viewBlog.id,
          useBlogPost().viewBlog
        );
      }
    },

    async deleteBlog(id: string) {
      await deleteDoc(doc(db, "Blogs", id));

      router.push("/");
    },

    async addNestedComment(level: any, body: string) {
      const levels = level.split(" ");
      let location = "this.comments";
      for (let i = 0; i < levels.length; i++) {
        location += `[${levels[i]}].replies`;
      }
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const date = formatter.format(now);
      const comment = {
        displayName: this.displayName,
        body: body,
        date: date,
        replies: [],
      };
      location += `.push(comment)`;
      eval(location);
      await setDoc(doc(db, "Comments", useBlogPost().viewBlog.id), {
        ...this.comments,
      });
    },

    async addComment(addComment: string) {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const date = formatter.format(now);
      const newComment = {
        displayName: this.displayName,
        body: addComment,
        date: date,
        replies: [],
      };
      this.comments.push(newComment);
      await setDoc(doc(db, "Comments", useBlogPost().viewBlog.id), {
        ...this.comments,
      });
    },

    async editBlog(
      addTitle: string,
      addContent: string,
      addImgURL: string,
      id: string,
      blog: Blog,
      changeRoutes = true
    ) {
      const newBlog = { ...blog };
      newBlog.blogTitle = addTitle;
      newBlog.blogContent = addContent;
      newBlog.imgURL = addImgURL;
      try {
        await setDoc(doc(db, "Blogs", id), newBlog);
      } catch (error) {
        this.getBlog(id);
      }

      if (changeRoutes) router.push("/");
    },
  },
});

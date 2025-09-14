// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyA7fGPXVJaNWJUKU9Q1WlW3XKcQQQ5TdVM",
//   authDomain: "p2plending-53ddb.firebaseapp.com",
//   projectId: "p2plending-53ddb",
//   storageBucket: "p2plending-53ddb.firebasestorage.app",
//   messagingSenderId: "923249703074",
//   appId: "1:923249703074:web:7cd99f4c673f9c3941bffb",
//   measurementId: "G-898FF95GPT"
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const googleProvider = new GoogleAuthProvider();
// export const db = getFirestore(app);

// // Helper function to create a new loan request
// export const createLoanRequest = async (loanData) => {
//   try {
//     const docRef = await addDoc(collection(db, "loanRequests"), {
//       amount: Number(loanData.amount),
//       fundedAmount: 0, // Initialize as 0
//       interest: Number(loanData.interest),
//       total: Number(loanData.total),
//       date: new Date(),
//       status: "pending",
//       borrowerId: loanData.borrowerId,
//       borrowerName: loanData.borrowerName,
//       platformFeeRate: Number(loanData.platformFeeRate)
//     });
//     return docRef.id;
//   } catch (error) {
//     console.error("Error creating loan request:", error);
//     throw error;
//   }
// };

// // Helper function to update a loan request
// export const updateLoanRequest = async (requestId, updateData) => {
//   try {
//     await updateDoc(doc(db, "loanRequests", requestId), updateData);
//   } catch (error) {
//     console.error("Error updating loan request:", error);
//     throw error;
//   }
// };

// // Authentication functions
// export const signInWithGoogle = async () => {
//   try {
//     const result = await signInWithPopup(auth, googleProvider);
//     return result.user;
//   } catch (error) {
//     console.error("Error signing in with Google:", error);
//     throw error;
//   }
// };

// export const signOut = async () => {
//   try {
//     await auth.signOut();
//   } catch (error) {
//     console.error("Error signing out:", error);
//     throw error;
//   }
// };
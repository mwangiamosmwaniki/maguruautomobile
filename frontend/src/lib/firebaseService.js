import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import emailjs from "@emailjs/browser";

// ─── CARS OPERATIONS ───────────────────────────────────

export const fetchCars = async () => {
  try {
    const carsCollection = collection(db, "cars");
    const q = query(carsCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching cars:", error);
    throw error;
  }
};

export const fetchCarById = async (carId) => {
  try {
    const carDoc = doc(db, "cars", carId);
    const snapshot = await getDoc(carDoc);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching car:", error);
    throw error;
  }
};

export const createCar = async (carData) => {
  try {
    const carsCollection = collection(db, "cars");
    const docRef = await addDoc(carsCollection, {
      ...carData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating car:", error);
    throw error;
  }
};

export const updateCar = async (carId, carData) => {
  try {
    const carDoc = doc(db, "cars", carId);
    await updateDoc(carDoc, {
      ...carData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating car:", error);
    throw error;
  }
};

export const deleteCar = async (carId) => {
  try {
    const carDoc = doc(db, "cars", carId);
    await deleteDoc(carDoc);
  } catch (error) {
    console.error("Error deleting car:", error);
    throw error;
  }
};

export const fetchCarsByCondition = async (condition) => {
  try {
    const carsCollection = collection(db, "cars");
    const q = query(
      carsCollection,
      where("condition", "==", condition),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching cars by condition:", error);
    throw error;
  }
};

// ─── INQUIRIES OPERATIONS ──────────────────────────────

export const fetchInquiries = async () => {
  try {
    const inquiriesCollection = collection(db, "inquiries");
    const q = query(inquiriesCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
      // Convert Firestore Timestamp → JS Date for timeAgo()
      date: document.data().createdAt?.toDate?.() ?? new Date(),
    }));
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    throw error;
  }
};

export const updateInquiryStatus = async (inquiryId, status) => {
  try {
    const inquiryDoc = doc(db, "inquiries", inquiryId);
    await updateDoc(inquiryDoc, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    throw error;
  }
};

export const deleteInquiry = async (inquiryId) => {
  try {
    const inquiryDoc = doc(db, "inquiries", inquiryId);
    await deleteDoc(inquiryDoc);
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    throw error;
  }
};

export const createInquiry = async (inquiryData) => {
  try {
    const inquiriesCollection = collection(db, "inquiries");
    const docRef = await addDoc(inquiriesCollection, {
      name: inquiryData.name,
      email: inquiryData.email,
      phone: inquiryData.phone,
      message: inquiryData.message,
      carId: inquiryData.carId,
      carTitle: inquiryData.carTitle,
      createdAt: Timestamp.now(),
      status: "new",
    });

    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

    const adminEmailParams = {
      carTitle: inquiryData.carTitle,
      name: inquiryData.name,
      email: inquiryData.email,
      phone: inquiryData.phone,
      message: inquiryData.message,
      timestamp: new Date().toLocaleString("en-KE", {
        timeZone: "Africa/Nairobi",
      }),
    };

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID,
        adminEmailParams,
      );
    } catch (emailError) {
      console.error("Failed to send admin email:", emailError);
    }

    const customerEmailParams = {
      carTitle: inquiryData.carTitle,
      name: inquiryData.name,
      email: inquiryData.email,
      message: inquiryData.message,
    };

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID,
        customerEmailParams,
      );
    } catch (emailError) {
      console.error("Failed to send customer email:", emailError);
    }

    return docRef.id;
  } catch (error) {
    console.error("Error creating inquiry:", error);
    throw error;
  }
};

// ─── USERS OPERATIONS ──────────────────────────────────

export const fetchUsers = async () => {
  try {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const usersCollection = collection(db, "users");
    const docRef = await addDoc(usersCollection, {
      ...userData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const userDoc = doc(db, "users", userId);
    await updateDoc(userDoc, {
      ...userData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const userDoc = doc(db, "users", userId);
    await deleteDoc(userDoc);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// ─── STATISTICS OPERATIONS ────────────────────────────

export const fetchDashboardStats = async () => {
  try {
    const carsCollection = collection(db, "cars");
    const inquiriesCollection = collection(db, "inquiries");

    const carsSnapshot = await getDocs(carsCollection);
    const inquiriesSnapshot = await getDocs(inquiriesCollection);

    const cars = carsSnapshot.docs.map((doc) => doc.data());
    const inquiries = inquiriesSnapshot.docs.map((doc) => doc.data());

    const availableCars = cars.filter(
      (car) => car.status === "Available",
    ).length;
    const soldCars = cars.filter((car) => car.status === "Sold").length;
    const pendingInquiries = inquiries.filter(
      (inq) => inq.status === "new",
    ).length;

    return {
      totalCars: cars.length,
      availableCars,
      soldCars,
      totalInquiries: inquiries.length,
      pendingInquiries,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

export const fetchUserFromFirebase = async (userId) => {
  try {
    const userDoc = doc(db, "users", userId);
    const snapshot = await getDoc(userDoc);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

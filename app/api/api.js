import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const getRiceMillRecords = async () => {
  try {
    const recordsRef = collection(db, "rice-mill-records");
    const recordsQuery = query(recordsRef, orderBy("createdAt", "desc")); // 🔥 sort by createdAt DESCENDING
    const querySnapshot = await getDocs(recordsQuery);

    const records = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return records;
  } catch (error) {
    console.error("Error fetching rice mill records: ", error);
    throw error;
  }
};

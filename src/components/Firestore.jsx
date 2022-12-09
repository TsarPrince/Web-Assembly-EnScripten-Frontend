import { collection, addDoc, getDocs } from "firebase/firestore";
import { useState } from "react";

const Firestore = ({ data }) => {
  const [codes, setCodes] = useState([])
  const { db } = require('../firebase');
  let uid;
  const addData = async (e) => {
    e.preventDefault();

    if (localStorage.getItem('user')) {
      uid = JSON.parse(localStorage.getItem('user')).uid;
    }
    if (!uid) {
      alert('Please Sign-up first!');
      return;
    }
    try {
      data.name = document.querySelector('#file-name').value;
      console.log(data);
      const docRef = await addDoc(collection(db, `users/${uid}/codes-collection`), data);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  const fetchData = async (e) => {
    e.preventDefault();

    if (localStorage.getItem('user')) {
      uid = JSON.parse(localStorage.getItem('user')).uid;
    }
    if (!uid) {
      alert('Please Sign-up to access your saved codes.');
      return;
    }
    const querySnapshot = await getDocs(collection(db, `users/${uid}/codes-collection`));
    let results = [];
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, doc.data());
      results.push({
        id: doc.id, ...doc.data()
      })
    })
    console.log(results);
    setCodes(results);
  }

  return (
    <div>
      <form onSubmit={addData}>
        <input type="text" name="file-name" id="file-name" placeholder="Enter file name" required />
        <input type="submit" value="Save code" />
        <button onClick={fetchData}>View your codes</button>
        {
          codes.map(code => ( 
            <div key={code.id} style={{
              margin: '2rem 0',
              padding: '0 1rem',
              borderRadius: '4px',
              border: `1px solid ${code.compiledSuccessfully ? 'green' : 'red'}`
            }}>
              <p style={{fontWeight: '500'}}>{code.name}</p>
              <p style={{fontWeight: '500'}}>Input:</p>
              <textarea id="#input" value={code.input} rows={8} disabled style={{width: '100%'}}></textarea>
              <p style={{fontWeight: '500'}}>Output:</p>
              <textarea id="#output" value={code.output} rows={8} disabled style={{width: '100%'}}></textarea>
            </div>
          ))
        }
      </form>
    </div>
  )
}

export default Firestore
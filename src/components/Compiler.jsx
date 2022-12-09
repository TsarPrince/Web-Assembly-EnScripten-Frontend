import { useState } from 'react';
import axios from 'axios';
import Firestore from './Firestore';

const Compiler = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const sendCompileRequest = async () => {
    setLoading(true);
    const input = document.querySelector('#input').value;
    // console.log(input);

    try {
      const response = await axios.post('http://43.206.220.45:8080/compile', {
        input
      })
      const output = response.data.output;
      const compiledSuccessfully = response.data.compiledSuccessfully;
      // console.log(response);
      setData({ input, output, compiledSuccessfully });
      document.querySelector('#output').value = output;
    } catch (err) {
      console.log(err);
      alert(err.response.data.message);
    }
    setLoading(false);
  }
  return (
    <div>
      <h1>C/C++ web compiler</h1>
      <p>Input</p>
      <textarea id="input" rows="8"></textarea>
      <button onClick={sendCompileRequest}>Compile and Run</button>
      <p>Output</p>
      <textarea id="output" rows="8" disabled></textarea>
      {
        loading
          ? <p>Execution in progress...</p>
          : <p></p>
      }
      <Firestore data={data} />

    </div>
  )
}

export default Compiler
import React, { useState } from "react";
import styles from '../styles/CreateItem.module.css';
import { Web3Storage } from 'web3.storage';


const CreateItem= () => {
  function getAccessToken () {
    const NEXT_PUBLIC_WEB3STORAGE_TOKEN ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDI4NDQyNzlkMDRmRDc2NDJDMUQyNzZhQkRmNDI3ZDBkOWJmMGU0NzkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTM0MzIxMDY3MjAsIm5hbWUiOiJkZXYifQ.gFBojcATcuBQeXse4O1OAVEIrrmdKPxyHlK83AaqZrQ'
    return NEXT_PUBLIC_WEB3STORAGE_TOKEN
  }

  function makeStorageClient () {
    return new Web3Storage({ token: getAccessToken() })
  }

  const client = makeStorageClient();
  
  
  const [newItem, setNewItem] = useState({
    title: "",
    creator: "", //use wallet address here when using blockchain?
    image_url: "",
    date_created: "",
    description: "",
  });
  const [file, setFile] = useState({});
  const [uploading, setUploading] = useState(false);
  
  async function onChange(e) {
    setUploading(true);
    const files = e.target.files;
    const cid = await client.put(files);
    try {
      console.log("got file",files[0]);
      setFile({ filename: files[0].name, hash: cid });
      alert("Item Grabbed, please finish info and click \"CREATE ITEM\".");
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
    setUploading(false);
  }

  const createItem = async () => {
    try {
      // Combine product data and file.name
      const item = { ...newItem, ...file };
      console.log("Sending product to api",item);
      const response = await fetch("../api/addItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
      const data = await response.json();
      if (response.status === 200) {
        alert("Item added!");
      }
      else{
        alert("Unable to add item: ", data.error);
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.background_blur}>
      <div className={styles.create_product_container}>
        <div className={styles.create_product_form}>
          <header className={styles.header}>
            <h1>Create Product</h1>
          </header>

          <div className={styles.form_container}>
            <input
              type="file"
              className={styles.input}
              accept=".png,.rar,.7zip,.jpeg"
              placeholder="Images"
              onChange={onChange}
            />
            {file.name != null && <p className="file-name">{file.filename}</p>}
            <div className={styles.flex_row}>
            <h3>Title:</h3>
              <input
                className={styles.input_name}
                type="text"
                placeholder="Item Title"
                onChange={(e) => {
                  setNewItem({ ...newItem, title: e.target.value });
                }}
              />

            </div>
            <div className={styles.flex_row}>
            <h3>Creator:</h3>
              <input
                className={styles.input}
                type="text"
                placeholder="@Pepe"
                onChange={(e) => {
                  setNewItem({ ...newItem, creator: e.target.value });
                }}
              /> 
            </div>
            
            <div className={styles.flex_row}>
            <h3>Image URL:</h3>
              <input
                className={styles.input}
                type="url"
                placeholder="Image URL ex: https://i.imgur.com/rVD8bjt.png"
                onChange={(e) => {
                  setNewItem({ ...newItem, image_url: e.target.value });
                }}
              />
            </div>      
            <textarea
              className={styles.text_area}
              placeholder="Description here..."
              onChange={(e) => {
                setNewItem({ ...newItem, description: e.target.value });
              }}
            />

            <button
              className={styles.button}
              onClick={() => {
                createItem();
                alert("Congrats, you're awesome at following directions!")
              }}
              disabled={uploading}
            >
              Create Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateItem;
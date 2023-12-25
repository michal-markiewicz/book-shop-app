"use client";
import * as XLSX from "xlsx";
import axios from "axios";

const Inventory = () => {
  return (
    <>
      <input
        type="file"
        onChange={async (event) => await uploadCatalog(event)}
      ></input>
    </>
  );
};

async function uploadCatalog(event) {
  const file = await event.target.files[0].arrayBuffer();
  const workbook = XLSX.read(file);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json(sheet);
  await axios.post("/api/products", json);
}

export default Inventory;

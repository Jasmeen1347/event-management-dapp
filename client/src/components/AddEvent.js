import React, { useState } from "react";
import { Button, FormGroup, FormText, Input, Label, Form } from "reactstrap";
import { create } from "ipfs-http-client";
import {Buffer} from 'buffer';
import {setAccountData} from '../contractData/ContractData'
import { ethers } from "ethers";
// const {create} =require('ipfs-http-client')
const projectId = '2MVQmcKU15VHOqAYEBSxUvZ4DLX';
const projectSecret = '991b079f3f2332ab12ed029b3925e4fe';
const auth = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client =create({
  host: "ipfs.infura.io",
  port:5001,
  protocol:"https",
  headers:{
  authorization:auth
  },
});

function AddEvent() {
  const { provider, signer, contract } = setAccountData()
  
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [totalSeats, setTotalSeats] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [image, setImage] = useState("")

  const [isDataUploading, setIsDataUploading] = useState(false);
  const [fileUploadMessage, setFileUploadMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault()
    const datetime = Date.parse(date + ' ' + time + ':00')
    const transcation = await contract.createEvent(name, description, datetime, ethers.utils.parseUnits(price).toString() ,totalSeats, location, image)
    await transcation.wait()
    console.log("transcation is done");
  }

  const uploadFiletoIPFS = async (event) => {
    event.preventDefault();
    const files = event.target.files;
    if (!files || files.length === 0) {
      return alert("No files selected");
    }
    const file = files[0];
    setIsDataUploading(true)
    setFileUploadMessage('Your file is being uploading please wait <br> once your file uploaded it will display below')
    // upload files
    // const result = await ipfs.add(file);
    const result=await client.add(
      file,{
        progress:(prog)=>console.log(`received:${prog}`)
      }
    )
    const url=`https://ineuron-jasmeen-nft.infura-ipfs.io/ipfs/${result.path}`

    setImage(url)
    setIsDataUploading(false)
    setFileUploadMessage('File successfully uploaded')
  }

  return (
    <div className="container mt-5">
      <h1>AddEvent</h1>
      <Form className="mt-5" onSubmit={(e) => handleSubmit(e)}>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter event name"
            type="text"
            required
            onChange={(e) => setName(e.target.value)}
          />
        </FormGroup>
        <div className="row">
          <div className="col-6">
          <FormGroup>
            <Label for="price"> Price </Label>
            <Input
              id="price"
              name="price"
              placeholder="Enter ticket price per persion"
              type="number"
              required
              min="0.01"
              step="0.01"
              onChange={(e) => setPrice(e.target.value)}
            />
          </FormGroup>
          </div>
          <div className="col-6">
            <FormGroup>
              <Label for="total_seats"> Total Seats </Label>
              <Input
                id="total_seats"
                name="total_seats"
                placeholder="Enter Total Seats"
                type="number"
                required
                min="0"
                onChange={(e) => setTotalSeats(e.target.value)}
              />
            </FormGroup>
          </div>
          <div className="col-6">
            <FormGroup>
              <Label for="date">  Date </Label>
              <Input
                id="date"
                name="date"
                placeholder="Enter Date"
                type="date"
                required
                className="w-25s"
                onChange={(e) => setDate(e.target.value)}
              />
            </FormGroup>
          </div>
          <div className="col-6">
            <FormGroup>
              <Label for="time">  Time </Label>
              <Input
                id="time"
                name="time"
                placeholder="Enter Time"
                type="time"
                required
                className="w-25s"
                onChange={(e) => setTime(e.target.value)}
              />
            </FormGroup>
          </div>
        </div>
        <FormGroup>
          <Label for="description">  Description </Label>
          <Input
            id="description"
            name="text"
            type="textarea"
            required
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="Enter event Location"
            type="text"
            required
            onChange={(e) => setLocation(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label for="image">Image</Label>
          <Input
            id="image"
            placeholder="Upload event image"
            type="file"
            onChange={(e) => uploadFiletoIPFS(e)}
          />
          <p className="mt-2">{fileUploadMessage}</p>
        </FormGroup>

        {image && (
          <img src={image} alt="event " height="200" width="200" />
        )}
       
        <br/>
        <Button className="custom-button-color mt-2" disabled={isDataUploading}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default AddEvent;

import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import {setAccountData} from '../contractData/ContractData'
import { ethers } from "ethers";
import useAccountStore from "../store/store";

function EventList() {
  const { provider, signer, contract } = setAccountData()
  const connectedAccount = useAccountStore((state) => state.account)

  const [events, setEvents] = useState([
    {
      title: "Title",
      description: "Description",
      location: "location",
      image: "image",
    },
    {
      title: "Title",
      description: "Description",
      location: "location",
      image: "image",
    },
    {
      title: "Title",
      description: "Description",
      location: "location",
      image: "image",
    },
    {
      title: "Title",
      description: "Description",
      location: "location",
      image: "image",
    }
  ])

  const [tickets, setTickets] = useState([])

  useEffect(() => {
    handleSubmit()
  }, [])

  const handleSubmit = async () => {
    const { ethereum } = window;
    if (ethereum) {
      const result = await contract.getAllEvents()
      const result2 = await contract.getMyTickets()
      setEvents(result)
      setTickets(result2)
    }

  }


  return (
    <div className="container">
      {connectedAccount && (
        <>
          <div className="upcomming-event mt-5">
            <h2 className="mb-3">Upcomming Events</h2>
            <div className="row">
              {/* {events.map((event, index) => ( */}
              {events.filter((event) => (parseFloat(event.date) > Date.parse(new Date()))).map((event, index) => (
                <div className="col-3" key={index + 1}>
                  <EventCard eventDetail={event} tickets={tickets} />
                </div>
              ))}
              </div>
          </div>
          <div className="past-event mt-5 mb-5">
            <h2 className="mb-3">Past Events</h2>
          
            <div className="row">
              {/* {events.map((event, index) => ( */}
              {events.filter((event) => (parseFloat(event.date) < Date.parse(new Date()))).map((event, index) => (
                <div className="col-3" key={index + 2}>
                  <EventCard eventDetail={ event } tickets={tickets} />
                </div>
              ))}
              </div>
          </div>
        </>
      )}
      {!connectedAccount && window.ethereum && (
          <h1 className="mt-4 text-center">Please Connect to MetaMask</h1>
      )}
      {!window.ethereum && (
          <h1 className="mt-4 text-center">Please Install MetaMask</h1>
      )}
    </div>
  );
}

export default EventList;

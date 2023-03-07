import React, { useEffect, useState } from "react";
import { setAccountData } from "../contractData/ContractData";
import useAccountStore from "../store/store";
import EventCard from "./EventCard";

function MyEvent() {
  const { provider, signer, contract } = setAccountData()
  const account = useAccountStore((state) => state.account)
  const [events, setEvents] = useState([])
  const [tickets, setTickets] = useState([])

  useEffect(() => {
    handleSubmit()
  }, [])

  const handleSubmit = async () => {
    const result = await contract.getAllEvents()
    const result2 = await contract.getMyTickets()
    // let result = await transcation.wait()
    let tmp = []
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
        if (element.organizer.toLowerCase() == account.toLowerCase()) {
          tmp.push(element)
        }
    }

    console.log(result);
    setEvents(tmp)
    setTickets(result2)
    console.log("transcation is done");
  }

  return (
    <div className="container">
      <div className="upcomming-event mt-5">
        <h2 className="mb-3">Upcomming Events</h2>
        <div className="row">
          {events.filter((event) => (parseFloat(event.date) > Date.parse(new Date()))).map((event, index) => (
            <div className="col-3" key={index + 1}>
              <EventCard eventDetail={ event } tickets={tickets} />
            </div>
          ))}
          </div>
      </div>
      <div className="past-event mt-5 mb-5">
        <h2 className="mb-3">Past Events</h2>
      
        <div className="row">
          {events.filter((event) => (parseFloat(event.date) < Date.parse(new Date()))).map((event, index) => (
            <div className="col-3" key={index + 1}>
              <EventCard eventDetail={ event } tickets={tickets} />
            </div>
          ))}
          </div>
        </div>
    </div>
  );
}

export default MyEvent;

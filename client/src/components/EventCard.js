import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle, FormGroup, Input, InputGroup, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { BsCheckCircleFill } from "react-icons/bs";
import { ethers } from "ethers";
import {setAccountData} from '../contractData/ContractData'
import useAccountStore from "../store/store";

function EventCard({ eventDetail, tickets }) {
  const { provider, signer, contract } = setAccountData()
  const account = useAccountStore((state) => state.account)

  const [numberOfTickets, setNumberOfTickets] = useState(0);
  const [isRegisterd, setIsRegisterd] = useState(false);
  const [registerdUser, setRegisterdUser] = useState([]);
  const [ticketId, setTicketId] = useState("");
  const [reciverAddress, setReciverAddress] = useState('');

  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);

  const toggle = () => setModal(!modal);
  const toggle2 = () => setModal2(!modal2);


  useEffect(() => {
    if (tickets.length > 0) {
      let tmp = []
      for (let index = 0; index < tickets.length; index++) {
        const element = tickets[index];
        if (parseFloat(element.eventId) === parseFloat(eventDetail.id)) {
          if (element.buyerId.toLowerCase() == account.toLowerCase()) {
            setIsRegisterd(true)
            setTicketId(index)
          }
          tmp.push(element.buyerId.toUpperCase())
        }
      }
      setRegisterdUser(tmp)
    }

    // console.log(account);
  }, [eventDetail])

  const buyTickets = async () => {
    let price = ethers.utils.formatEther(eventDetail.price) * numberOfTickets
    console.log(parseInt(eventDetail.id), price, numberOfTickets);
    const transcation = await contract.buyTicket(
      parseInt(eventDetail.id), parseInt(numberOfTickets),
      { value: ethers.utils.parseUnits(price.toString()) })
    await transcation.wait()
    console.log("transcation is done"); 
  }

  const transferTickets = async () => {
    const transcation = await contract.transferTickets(
      parseInt(ticketId), parseInt(eventDetail.id),parseInt(numberOfTickets), reciverAddress)
    await transcation.wait()
    console.log("transcation is done"); 
  }

  return (
    <div className="event-card">
      <Card>
        {isRegisterd && (
          <BsCheckCircleFill className="circle-check-icon" />
        )}
          <img
          alt="Sample"
          className="card-image"
          src={eventDetail.imagepath || "https://picsum.photos/300/200"}
          />
          <CardBody>
            <CardTitle tag="h5">
              {eventDetail.name}
            </CardTitle>
            <CardSubtitle
              className="mb-2 text-muted"
              tag="h6"
          >
            {eventDetail.date && (
              <p>{new Date(parseFloat(eventDetail.date)).toLocaleString()}</p>
              )}
              {eventDetail.location}
            </CardSubtitle>
            <CardText>
              {eventDetail.description}
            </CardText>
            <Button onClick={() => toggle()}>
              View
            </Button>
          </CardBody>
      </Card>
      
      <Modal size="xl" isOpen={modal} toggle={toggle}>
          <div className="row">
          <div className="col-6">
            <img
              alt="Sample"
              className="w-100 h-100"
              src={eventDetail.imagepath || "https://picsum.photos/600/600"}
            />  
          </div>
          <div className="col-6 mb-5">
            <p className="close display-5 text-end me-4 cursor-pointer" onClick={toggle}>
              &times;
            </p>
            <h2 className="mt-4">{eventDetail.name}</h2>
            <p className="mt-3">{eventDetail.description}</p>
            <p>Date: <strong>{new Date(parseFloat(eventDetail.date)).toLocaleString()}</strong></p>
            <p>Price: <strong>{ethers.utils.formatEther(eventDetail.price || 0) || 0} eth</strong></p>
            <p>Location: {eventDetail.location}</p>
            <p>Total Seats: <strong>{parseFloat(eventDetail.ticketCount) || 0}</strong></p>
            <p>Availabe Seats: <strong>{parseFloat(eventDetail.ticketRemain) || 0}</strong></p>
            <p className="text-success fw-bold">{isRegisterd ? 'You are attending this event.' : ''}</p>
            {window.location.pathname === "/myevent" && (
              <>
                <p>Occupied Seats: <strong>{parseFloat(eventDetail.ticketCount) - parseFloat(eventDetail.ticketRemain)}</strong></p>
                <p>Total Recived Balance: <strong>{(parseFloat(eventDetail.ticketCount) - parseFloat(eventDetail.ticketRemain)) * ethers.utils.formatEther(eventDetail.price || 0)} eth</strong></p>
                <Button onClick={() => toggle2()}>View Registerd Users</Button>
              </>
            )}
            {!isRegisterd && eventDetail.organizer.toLowerCase() !== account.toLowerCase() &&  (
              <InputGroup className="mt-5 w-75">
                <Input type="number" placeholder="Enter Number of tickes" onChange={(e) => setNumberOfTickets(e.target.value)}/>
                <Button onClick={() => buyTickets()}>Buy tickets</Button>
              </InputGroup>
            )}

            {/* {window.location.pathname === "/myevent" && ( */}
            {isRegisterd && (
              <>
                <h5 className="mt-3">Transfer Tickets</h5>
                <InputGroup className="mt-3 pe-3">
                  <Input type="text"  className="w-100" placeholder="Enter Address" onChange={(e) => setReciverAddress(e.target.value)}/>
                  <Input type="number" className="w-25 mt-2" placeholder="Number of tickes" onChange={(e) => setNumberOfTickets(e.target.value)}/>
                  <Button className="w-25 ms-2 mt-2" onClick={() => transferTickets()}>Transfer tickets</Button>
                </InputGroup>
              </>
            )}

          </div>
          </div>
      </Modal>

      <Modal size="xl" isOpen={modal2} toggle={toggle2}>
        <div className="row">
          <div className="col-6">
            <img
              alt="Sample"
              className="w-100"
              src={eventDetail.imagepath || "https://picsum.photos/600/600"}
            />  
          </div>
          <div className="col-6">
            <p className="close display-5 text-end me-4 cursor-pointer" onClick={toggle2}>
              &times;
            </p>
            <h2 className="mt-4">{eventDetail.name}</h2>
            <div className="me-5">
              <table className="mt-4 table overflow-auto">
                <thead>
                    <th>Sr. No.</th>
                    <th>Registerd Users Address</th>
                </thead>
                <tbody>
                  {registerdUser.map((user, index) => (
                    <tr>
                      <td>{ index + 1 }</td>
                      <td>{user}</td>
                    </tr>
                  ))}
                </tbody>
                </table>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default EventCard;

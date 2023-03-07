// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract EventContract {

    struct Event {
        uint id;
        address organizer;
        string name;
        uint date;
        uint price;
        uint ticketCount;
        uint ticketRemain;
        string location;
        string description;
        string imagepath;
    }

    mapping(address=>Event[]) events;  // for find out user wise

    Event[] private eventlist;


    struct Ticket {
        uint eventId;
        address buyerId;
        uint numberOfTickets;
    }

    // mapping(address=>Ticket[]) tickets;  // for find out user wise

    Ticket[] private ticketlist;

    function createEvent(string memory name, string memory description, uint date, uint price, uint ticketCount, string memory location, string memory imageurl) external {
        require(date>block.timestamp, "You can organize event for future date");
        require(ticketCount > 0, "You can organize event only if you create more then 0 tickets");
        uint _id = eventlist.length;
        uint _price = price;
       eventlist.push(Event(_id, msg.sender, name, date, _price, ticketCount, ticketCount, location, description, imageurl));
       events[msg.sender].push(Event(_id, msg.sender, name, date, _price, ticketCount, ticketCount, location, description, imageurl));
    }

    function buyTicket(uint id, uint quantity) public payable {
        require(eventlist[id].date != 0, "Event does not exist");
        require(block.timestamp < eventlist[id].date, "Event has already occure");

        Event storage _event = eventlist[id];
        require(msg.value == (_event.price*quantity), "Ether is not enough");
        require(_event.ticketRemain >= quantity, "not enough tickets");

        (bool sent,) = payable(eventlist[id].organizer).call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        _event.ticketRemain -= quantity;

         for(uint i = 0; i < events[msg.sender].length; i++) {
            if(events[msg.sender][i].id == id) {
                events[msg.sender][i].ticketRemain -= quantity;
            }
         }

        ticketlist.push(Ticket(id, msg.sender, quantity));
        // tickets[msg.sender].push(Ticket(id, msg.sender, quantity));
    }

    function transferTickets(uint ticketId, uint eventId, uint quantity, address to) public{
        require(eventlist[eventId].date != 0, "Event does not exist");
        require(block.timestamp < eventlist[eventId].date, "Event has already occure");
        require(ticketlist[ticketId].numberOfTickets >= quantity, "You do not have enough tickets");

        ticketlist[ticketId].numberOfTickets -= quantity;
        ticketlist.push(Ticket(eventId, to, quantity));
        // tickets[to].push(Ticket(eventId, to, quantity));
        // for(uint i = 0; i < ticketlist.length; i++) {
        //     if(ticketlist[i].buyerId == msg.sender && ticketlist[i].eventId == eventId) {
        //         require(ticketlist[i].numberOfTickets >= quantity, "You do not have enough tickets");

        //         ticketlist[i].numberOfTickets -= quantity;
        //         ticketlist.push(Ticket(eventId, to, quantity));
        //         tickets[to].push(Ticket(eventId, to, quantity));
        //         break;
        //     }
        // }
    }

    function getMyEvents() public view returns(Event[] memory){
        return events[msg.sender];
    }

    function getAllEvents() public view returns(Event[] memory){
        return eventlist;
    }

    function getMyTickets() public view returns(Ticket[] memory){
        return ticketlist;
    }


}
import React, { useEffect, useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  Button,
} from 'reactstrap';
import { Outlet, Link } from "react-router-dom";
import useAccountStore from '../store/store';
import Footer from './Footer';


const NavBar = (args) => {

  const conncectWallet = useAccountStore((state) => state.conncectWallet)
  const connectedAccount = useAccountStore((state) => state.account)

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      window.ethereum.on('accountsChanged', () => {
        conncetMetamask()
      })
    }
  }, [])


  const conncetMetamask = async () => {
    const { ethereum } = window;
    let account;
    if (ethereum) {
      try {
        account = await ethereum.request({ method: 'eth_requestAccounts' })
        let temp = account[0]
        conncectWallet(temp)
      } catch (error) {
        conncectWallet("")
      }
    } else {
      console.log("Please Install Metamask")
    }
  }

  return (
    <div>
      <Navbar container='lg'>
        <NavbarBrand href="/">Event Managemnt</NavbarBrand>
          <Nav className="">
          {connectedAccount && (
            <>
            <NavItem>
              <Link className='nav-link' to="/">Home</Link>
          </NavItem>

            <NavItem>
              <Link className='nav-link' to="/addevent">Add Event</Link>
            </NavItem>
            <NavItem>
              <Link className='nav-link' to="/myevent">My Event</Link>
            </NavItem>
              </>
          )}
          {/* <Button onClick={() => conncetMetamask()}>Connect</Button> */}
          {!connectedAccount && (
              <Button onClick={() => conncetMetamask()}>Connect</Button>
          )}
          {connectedAccount && (
              <Button onClick={() => conncetMetamask()}>{connectedAccount.slice(0, 5) + '...' + connectedAccount.slice(27, 32)}</Button>
          )}
          </Nav>
      </Navbar>
      <Outlet />
      <Footer />
    </div>
  );
}

export default NavBar;
"use client";

import React from 'react';
import { Layout, Menu } from 'antd';
import Link from 'next/link';
import { Nav, NavItem, NavList } from '../header/styles';
import { Copyright } from './styles';

const { Footer: AntFooter } = Layout;

const Footer = () => {
  return (
    <AntFooter className="flex items-center justify-between bg-gray-100 py-4">
      <Copyright>Desenvolvido por <Link target="blank" href="https://github.com/wesandradealves">Wesley Alves</Link></Copyright>
      <NavList className='ms-auto'>
        <Nav className='list-none flex items-center justify-end gap-4'>
          <NavItem>
            <Link target='_blank' href="http://localhost:8000/docs">Documentaçâo</Link>
          </NavItem>
          <NavItem>
            <Link target='_blank' href="https://github.com/wesandradealves/SmartMart-Solutions">Repositório</Link>
          </NavItem>
        </Nav>
      </NavList>
    </AntFooter>
  );
};

export default Footer;

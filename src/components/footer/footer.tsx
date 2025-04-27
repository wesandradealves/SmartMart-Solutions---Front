"use client";

import React from 'react';
import { Layout } from 'antd';
import Link from 'next/link';
import { Copyright } from './styles';

const { Footer: AntFooter } = Layout;

const Footer = () => {
  return (
    <AntFooter className="flex bg-gray-300 p-0 -m-4 px-8 py-[.89rem] items-center justify-end">
      <Copyright>Desenvolvido por <Link target="blank" href="https://github.com/wesandradealves">Wesley Alves</Link></Copyright>
    </AntFooter>
  );
};

export default Footer;

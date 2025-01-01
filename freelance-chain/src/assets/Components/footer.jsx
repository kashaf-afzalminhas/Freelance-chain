import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#0C3B2E] text-white py-8">
      <div className="container mx-auto grid md:grid-cols-3 gap-8 px-6">
        <div>
          <h4 className="text-xl font-bold">freelance-Chain</h4>
          <p className="mt-4 text-gray-400">
            Drive growth, retain customers, and scale up effortlessly with
            FreeLance-Chain.
          </p>
          <p className="mt-2 text-gray-400">mailto@subx.com</p>
        </div>
        <div>
          <h4 className="text-lg font-bold">Features</h4>
          <ul className="mt-4 space-y-2 text-gray-400">
            <li>Business Messenger</li>
            <li>Customizable bots</li>
            <li>Automated answers</li>
            <li>Product Tours</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold">Resources</h4>
          <ul className="mt-4 space-y-2 text-gray-400">
            <li>Whitepapers & Blog</li>
            <li>Watch a Demo</li>
            <li>Product Glossary</li>
            <li>Industry Reports</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-500 text-sm">
        © Copyright freelance-Chain. All rights reserved. Made with love by Mahative.
      </div>
    </footer>
  );
};

export default Footer;

import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="text-white bg-gray-800 py-4">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-2 md:mb-0">
          <Image src="/logo-icon.png" alt="logo icon" width={50} height={50} />
          <span className="text-lg font-semibold ml-2">Parazone</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link className="text-sm hover:underline" href="/privacy-policy">
            Privacy Policy
          </Link>
          <Link className="text-sm hover:underline" href="/terms-of-service">
            Terms of Service
          </Link>
          <Link className="text-sm hover:underline" href="/contact-us">
            Contact Us
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;

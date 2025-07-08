import { Link } from "wouter";
import { Heart, Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-dark-grey border-t border-gray-700 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="text-gold text-2xl" />
              <h3 className="text-xl font-bold text-white">Elite Dental Care</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Providing exceptional dental care with a personal touch in a modern, comfortable environment.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gold hover:text-warm-gold transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gold hover:text-warm-gold transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gold hover:text-warm-gold transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gold hover:text-warm-gold transition-colors duration-200">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/" className="hover:text-gold transition-colors duration-200">Home</Link></li>
              <li><Link href="/doctor" className="hover:text-gold transition-colors duration-200">Our Doctor</Link></li>
              <li><Link href="/booking" className="hover:text-gold transition-colors duration-200">Book Appointment</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-gold transition-colors duration-200">General Dentistry</a></li>
              <li><a href="#" className="hover:text-gold transition-colors duration-200">Cosmetic Dentistry</a></li>
              <li><a href="#" className="hover:text-gold transition-colors duration-200">Restorative Care</a></li>
              <li><a href="#" className="hover:text-gold transition-colors duration-200">Preventive Care</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Info</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <Phone className="text-gold mr-2" size={16} />
                (555) 123-4567
              </li>
              <li className="flex items-center">
                <Mail className="text-gold mr-2" size={16} />
                info@elitedentalcare.com
              </li>
              <li className="flex items-start">
                <MapPin className="text-gold mr-2 mt-1" size={16} />
                <span>123 Dental Street<br />Medical Plaza, Suite 456<br />Healthville, HV 12345</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Elite Dental Care. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

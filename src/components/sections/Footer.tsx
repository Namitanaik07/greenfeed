import { Heart, Mail, MapPin, Phone, Instagram, Twitter, Linkedin, Globe } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    company: [
      { name: "About GreenFeed", href: "#" },
      { name: "Our Mission", href: "#" },
      { name: "Team", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press Kit", href: "#" }
    ],
    features: [
      { name: "How It Works", href: "#" },
      { name: "Rewards System", href: "#" },
      { name: "Hardware Vision", href: "#" },
      { name: "Community", href: "#" },
      { name: "API Access", href: "#" }
    ],
    support: [
      { name: "Help Center", href: "#" },
      { name: "Contact Us", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" }
    ],
    partners: [
      { name: "Amazon", href: "#" },
      { name: "Flipkart", href: "#" },
      { name: "Environmental NGOs", href: "#" },
      { name: "Local Governments", href: "#" },
      { name: "Become Partner", href: "#" }
    ]
  };

  const socialLinks = [
    { icon: Instagram, href: "#", name: "Instagram", color: "hover:text-pink-400" },
    { icon: Twitter, href: "#", name: "Twitter", color: "hover:text-blue-400" },
    { icon: Linkedin, href: "#", name: "LinkedIn", color: "hover:text-blue-600" },
    { icon: Globe, href: "#", name: "Website", color: "hover:text-green-400" }
  ];

  return (
    <footer className="bg-background-secondary border-t border-primary/20">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-orbitron font-black text-primary">GreenFeed</h3>
                <p className="text-sm text-foreground/60">Every post counts.</p>
              </div>
            </div>
            
            <p className="text-foreground/70 mb-6 leading-relaxed">
              Making environmental action as engaging and rewarding as social media. 
              Join the movement that's turning eco-consciousness into the next viral trend.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-sm text-foreground/60">
                <Mail className="w-4 h-4 text-primary" />
                <span>hello@greenfeed.eco</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-foreground/60">
                <Phone className="w-4 h-4 text-primary" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-foreground/60">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Bangalore, Karnataka, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 bg-gradient-card rounded-lg flex items-center justify-center transition-colors ${social.color} hover:scale-110 transform duration-200`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className="font-orbitron font-bold mb-6 text-primary">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-foreground/60 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-orbitron font-bold mb-6 text-secondary">Features</h4>
            <ul className="space-y-3">
              {footerLinks.features.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-foreground/60 hover:text-secondary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-orbitron font-bold mb-6 text-accent">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-foreground/60 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Partners Section */}
        <div className="border-t border-primary/10 pt-8 mb-8">
          <h4 className="font-orbitron font-bold mb-6 text-center text-accent-solar">Our Partners</h4>
          <div className="flex flex-wrap justify-center gap-6">
            {footerLinks.partners.map((partner, index) => (
              <a
                key={index}
                href={partner.href}
                className="px-4 py-2 bg-gradient-card rounded-lg text-sm text-foreground/70 hover:text-primary hover:bg-gradient-primary/10 transition-colors"
              >
                {partner.name}
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-primary/10 pt-8 mb-8">
          <div className="text-center max-w-2xl mx-auto">
            <h4 className="font-orbitron font-bold mb-4 text-xl">Stay Updated</h4>
            <p className="text-foreground/70 mb-6">
              Get the latest updates on GreenFeed features, eco-challenges, and rewards directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gradient-card border border-primary/20 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button className="px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:scale-105 transition-transform">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-foreground/60 mb-4 md:mb-0">
            © 2024 GreenFeed. All rights reserved. Made with{' '}
            <Heart className="w-4 h-4 inline text-red-500" />{' '}
            for our planet.
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-foreground/60">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Status: All Good</span>
            </div>
          </div>
        </div>

        {/* Environmental Impact Statement */}
        <div className="mt-8 text-center">
          <div className="glass-card p-6 rounded-xl max-w-4xl mx-auto">
            <h5 className="font-orbitron font-bold mb-3 text-primary">Our Environmental Commitment</h5>
            <p className="text-sm text-foreground/70 leading-relaxed">
              GreenFeed is carbon-neutral by design. Our servers run on 100% renewable energy, 
              and we plant a tree for every 1000 users who join our platform. 
              Together, we're not just talking about change - we're actively creating it.
            </p>
            <div className="flex justify-center items-center space-x-6 mt-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Carbon Neutral</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>100% Renewable Energy</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Trees Planted: 12,847</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
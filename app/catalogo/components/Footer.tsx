"use client";

import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* About */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-6">Mult Kits Brasil</h3>
                        <p className="text-sm leading-relaxed mb-6">
                            Sua parceira confiável em peças e acessórios. Qualidade, variedade e o melhor atendimento para o seu negócio.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-DEFAULT hover:text-white transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-DEFAULT hover:text-white transition-colors">
                                <Facebook size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-6">Links Rápidos</h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-primary-DEFAULT transition-colors">Início</a></li>
                            <li><a href="#" className="hover:text-primary-DEFAULT transition-colors">Catálogo Completo</a></li>
                            <li><a href="#" className="hover:text-primary-DEFAULT transition-colors">Sobre Nós</a></li>
                            <li><a href="#" className="hover:text-primary-DEFAULT transition-colors">Contato</a></li>
                            <li><a href="#" className="hover:text-primary-DEFAULT transition-colors">Política de Privacidade</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-6">Contato</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-primary-DEFAULT mt-0.5" />
                                <span>Rua Dr. Edgar de Barros 77, Amaralina<br />Salvador – BA, 41900-420</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-primary-DEFAULT" />
                                <span>71 3011 7296</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-4 h-4 invert brightness-0" />
                                <span>71 99234-4791</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-primary-DEFAULT" />
                                <span>contato@multkitsbrasil.com.br</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter removed as requested */}
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>&copy; 2025 Mult Kits Brasil. Todos os direitos reservados.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
                        <a href="#" className="hover:text-white transition-colors">Privacidade</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

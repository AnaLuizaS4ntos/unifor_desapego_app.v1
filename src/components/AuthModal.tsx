import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { X, Lock, Mail, User, GraduationCap, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { loginApi, registerApi, AuthUser } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Campos do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('Ciência da Computação');
  const [whatsapp, setWhatsapp] = useState('');

  const isUniforEmail = email.toLowerCase().endsWith('@unifor.br') || email.toLowerCase().endsWith('@edu.unifor.br');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await loginApi({ email, password });
        onSuccess(res.user);
        onClose();
      } else {
        if (!name.trim()) throw new Error('Informe seu nome completo.');
        if (!whatsapp.trim()) throw new Error('Informe seu WhatsApp para contato.');
        const res = await registerApi({
          name: name.trim(),
          email: email.trim(),
          password,
          course: course.trim(),
          whatsapp: whatsapp.trim(),
        });
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocorreu um erro. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      labelledBy="auth-modal-title"
      panelClassName="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#AE8FBA]/30 relative my-6 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-[#473469] text-white p-6 relative">
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-[#F79EB1] text-[#473469] flex items-center justify-center font-black">
            U
          </div>
          <span className="text-xs uppercase tracking-wider text-[#F79EB1] font-bold">UniDesapego UNIFOR</span>
        </div>
        <h2 id="auth-modal-title" className="text-xl font-bold text-[#F2E7D2]">
          {mode === 'login' ? 'Entrar na sua conta' : 'Criar conta de estudante'}
        </h2>
        <p className="text-xs text-[#AE8FBA] mt-1">
          {mode === 'login'
            ? 'Acesse para gerenciar seus desapegos e favoritos'
            : 'Cadastre-se com seu e-mail para ter o selo verificado UNIFOR'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-[#F8F7FA] p-1.5 gap-1.5 text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2 rounded-xl transition ${
            mode === 'login'
              ? 'bg-white text-[#473469] shadow-xs'
              : 'text-gray-500 hover:text-[#473469]'
          }`}
        >
          Entrar
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2 rounded-xl transition ${
            mode === 'register'
              ? 'bg-white text-[#473469] shadow-xs'
              : 'text-gray-500 hover:text-[#473469]'
          }`}
        >
          Criar Conta
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
        {errorMessage && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {mode === 'register' && (
          <div>
            <label className="block font-bold text-[#473469] mb-1">Nome Completo *</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Ex: Beatriz Lima"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#473469]"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block font-bold text-[#473469] mb-1">E-mail *</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="seu.nome@edu.unifor.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#473469]"
            />
          </div>
          {isUniforEmail && (
            <p className="text-[11px] text-[#059669] font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> E-mail UNIFOR reconhecido! Você ganhará o selo de aluno verificado.
            </p>
          )}
        </div>

        <div>
          <label className="block font-bold text-[#473469] mb-1">Senha *</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#473469]"
            />
          </div>
        </div>

        {mode === 'register' && (
          <>
            <div>
              <label className="block font-bold text-[#473469] mb-1">Curso na UNIFOR *</label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Medicina, Direito, Computação..."
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#473469]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#473469] mb-1">WhatsApp para Contato *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="85999887766"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 font-semibold text-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#473469]"
                />
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-3 bg-[#473469] hover:bg-[#352552] text-[#F2E7D2] font-bold rounded-2xl transition disabled:opacity-50"
        >
          {loading ? 'Processando...' : mode === 'login' ? 'Entrar' : 'Cadastrar e Conectar'}
        </button>
      </form>
    </Modal>
  );
};


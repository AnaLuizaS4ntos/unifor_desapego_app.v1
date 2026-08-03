import { useState } from 'react';
import { X, GraduationCap, CheckCircle2, ShieldCheck, Mail, Lock, Phone, User as UserIcon, Sparkles } from 'lucide-react';

const UNIFOR_COURSES = [
  'Ciência da Computação',
  'Engenharia de Computação',
  'Engenharia Civil',
  'Engenharia Mecânica',
  'Engenharia de Produção',
  'Medicina',
  'Enfermagem',
  'Odontologia',
  'Psicologia',
  'Direito',
  'Administração',
  'Arquitetura e Urbanismo',
  'Design de Moda',
  'Jornalismo',
  'Publicidade e Propaganda',
  'Outro Curso UNIFOR'
];

export const AuthModal = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout
}) => { 
  const [mode, setMode] = useState('register');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

   // Register form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [matricula, setMatricula] = useState('');
  const [course, setCourse] = useState('Ciência da Computação');
  const [semester, setSemester] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Por favor, informe seu e-mail e senha.');
      return;
    }

    try {
      const response = await fetch("https://uni-desapego-d2od.onrender.com/api/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.erro || 'E-mail ou senha incorretos.');
        return;
      }

      const realUser = {
        id: data.usuario?.id,
        name: data.usuario?.name,
        email: data.usuario?.email,
        matricula: data.usuario?.matricula || '',
        course: data.usuario?.course || '',
        semester: data.usuario?.semester || '',
        whatsapp: data.usuario?.whatsapp || '',
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.usuario?.name || 'user')}`,
        verifiedStudent: true
      };

      onLogin(realUser);
      onClose();

    } catch (error) {
      console.error("Erro na API de Login:", error);
      setErrorMessage('Erro de conexão com o servidor. O backend está rodando?');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !matricula.trim() || !password.trim()) {
      setErrorMessage('Preencha os campos obrigatórios, incluindo a senha.');
      return;
    }

    try {
      // A real requisitation for the backend on Python
      const response = await fetch("https://uni-desapego-d2od.onrender.com/api/auth/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          matricula: matricula.trim(),
          course: course,
          semester: semester,
          whatsapp: whatsapp.replace(/\D/g, ''),
          password: password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // if dont email in flask 
        setErrorMessage(data.erro || 'Erro ao realizar cadastro.');
        return;
      }

      // Real user
      const isUniforEmail = email.toLowerCase().includes('unifor') || email.toLowerCase().includes('.br');
      
      const newUser = {
        id: data.usuario?.id || `user-${Date.now()}`,
        name: data.usuario?.name || name,
        email: data.usuario?.email || email,
        matricula: matricula.trim(),
        course: course,
        semester: semester,
        whatsapp: whatsapp.replace(/\D/g, '') || '5585999887766',
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
        verifiedStudent: isUniforEmail || matricula.length >= 5
      };

      onLogin(newUser);
      onClose();
      
    } catch (error) {
      console.error("Erro na API:", error);
      setErrorMessage('Erro de conexão com o servidor. O backend está rodando?');
    }
  };
  
  // Demouser for tests
  const handleDemoLogin = () => {
    const demoUser = {
      id: 'demo-computacao',
      name: 'Sávio Oliveira',
      email: 'savio.computacao@unifor.br',
      matricula: '2210492',
      course: 'Ciência da Computação',
      semester: '5º Semestre',
      whatsapp: '5585988776655',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      verifiedStudent: true
    };
    onLogin(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#AE8FBA]/30 relative my-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#473469] text-white p-5 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F79EB1] to-[#AE8FBA] text-[#473469] flex items-center justify-center mx-auto mb-2 font-black shadow-md text-xl">
            <GraduationCap className="w-7 h-7 text-[#473469]" />
          </div>

          <h2 className="text-xl font-extrabold text-[#F2E7D2]">
            {currentUser ? 'Sua Conta UNIFOR' : mode === 'login' ? 'Acessar Conta' : 'Cadastro de Aluno'}
          </h2>
          <p className="text-xs text-[#AE8FBA] mt-0.5">
            Comunidade exclusiva de desapego e doações da UNIFOR
          </p>

          {/* Mode switcher tabs */}
          {!currentUser && (
            <div className="flex bg-[#352552] p-1 rounded-2xl mt-4 border border-[#AE8FBA]/30">
              <button
                onClick={() => { setMode('register'); setErrorMessage(''); }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                  mode === 'register' ? 'bg-[#F79EB1] text-[#473469] shadow-sm' : 'text-[#AE8FBA] hover:text-white'
                }`}
              >
                Cadastrar-se
              </button>
              <button
                onClick={() => { setMode('login'); setErrorMessage(''); }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                  mode === 'login' ? 'bg-[#F79EB1] text-[#473469] shadow-sm' : 'text-[#AE8FBA] hover:text-white'
                }`}
              >
                Já tenho conta
              </button>
            </div>
          )}
        </div>

        {/* Modal body */}
        <div className="p-6">
          
          {/* User loggad in */}
          {currentUser ? (
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <img
                  src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.name}`}
                  alt={currentUser.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-[#F79EB1] mx-auto shadow-md"
                />
                <span className="absolute bottom-0 right-0 bg-[#10B981] text-white p-1 rounded-full shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#473469] flex items-center justify-center gap-1.5">
                  {currentUser.name}
                  {currentUser.verifiedStudent && (
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" title="Verificado UNIFOR" />
                  )}
                </h3>
                <p className="text-xs text-[#4C5E91] font-semibold">{currentUser.course} • {currentUser.semester}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Matrícula: {currentUser.matricula} | {currentUser.email}</p>
              </div>

              <div className="bg-[#F8F7FA] border border-[#AE8FBA]/30 rounded-2xl p-3 text-left text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status Aluno:</span>
                  <span className="font-bold text-[#10B981]">Ativo na UNIFOR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">WhatsApp:</span>
                  <span className="font-semibold text-[#473469]">{currentUser.whatsapp}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={onLogout}
                  className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition"
                >
                  Sair da Conta
                </button>
              </div>
            </div>
          ) : mode === 'login' ? (
            /* Login form */
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {errorMessage && (
                <div className="bg-red-50 text-red-600 text-xs p-2.5 rounded-xl border border-red-200 font-medium">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#473469] uppercase mb-1">
                  E-mail Institucional ou Matrícula
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="ex: aluno@edu.unifor.br ou 2110492"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#473469]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#473469] uppercase mb-1">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#473469]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#473469] hover:bg-[#352552] text-[#F2E7D2] font-extrabold text-xs rounded-2xl shadow-md transition"
              >
                Entrar no UniDesapego
              </button>

              <div className="relative my-3 text-center">
                <span className="bg-white px-2 text-[10px] text-gray-400 font-semibold uppercase">ou teste rápido</span>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2.5 bg-[#F2E7D2] hover:bg-[#AE8FBA]/30 text-[#473469] font-bold text-xs rounded-xl transition border border-[#AE8FBA]/40 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F79EB1]" />
                Entrar com Conta Aluno Demo (CCT)
              </button>
            </form>
          ) : (
            /* Register form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {errorMessage && (
                <div className="bg-red-50 text-red-600 text-xs p-2.5 rounded-xl border border-red-200 font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-[#473469] uppercase mb-1">
                  Nome Completo *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Gabriel Sampaio"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#473469]"
                  />
                </div>
              </div>

              {/* Email and registration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#473469] uppercase mb-1">
                    E-mail UNIFOR *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="seu.nome@edu.unifor.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#473469]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#473469] uppercase mb-1">
                    Matrícula *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 2210492"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#473469]"
                  />
                </div>
              </div>

              {/* Course and semester */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#473469] uppercase mb-1">
                    Curso na UNIFOR
                  </label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#473469]"
                  >
                    {UNIFOR_COURSES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#473469] uppercase mb-1">
                    Semestre
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#473469]"
                  >
                    <option value="1º Semestre">1º Semestre</option>
                    <option value="2º Semestre">2º Semestre</option>
                    <option value="3º Semestre">3º Semestre</option>
                    <option value="4º Semestre">4º Semestre</option>
                    <option value="5º Semestre">5º Semestre</option>
                    <option value="6º Semestre">6º Semestre</option>
                    <option value="7º Semestre">7º Semestre</option>
                    <option value="8º Semestre">8º Semestre</option>
                    <option value="9º Semestre">9º Semestre</option>
                    <option value="10º Semestre">10º Semestre</option>
                    <option value="Graduado">Graduado</option>
                  </select>
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-[11px] font-bold text-[#473469] uppercase mb-1">
                  WhatsApp para contato (Com DDD)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="85999887766"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#473469]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold text-[#473469] uppercase mb-1">
                  Senha *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="Crie uma senha forte"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#473469]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs rounded-2xl shadow-md transition transform active:scale-98"
              >
                Criar Minha Conta no UniDesapego
              </button>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-[#473469] font-bold text-[11px] rounded-xl transition"
              >
                Ou entrar direto como Aluno Teste
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
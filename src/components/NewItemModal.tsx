import React, { useState } from 'react';
import { ItemCategory, ItemCondition, MarketplaceItem, UniforBloco } from '../types';
import { ITEM_CATEGORIES, ITEM_CONDITIONS, UNIFOR_BLOCOS } from '../constants';
import {
  buildItemFromForm,
  NewItemFormErrors,
  NewItemFormField,
  NewItemFormValues,
  validateNewItemForm,
} from '../lib/newItemForm';
import { loadSellerProfile, saveSellerProfile } from '../lib/itemStorage';
import { Modal } from './ui/Modal';
import { X, Gift, Check } from 'lucide-react';

interface NewItemModalProps {
  onClose: () => void;
  onAddItem: (item: MarketplaceItem) => void;
}

const PRESET_SAMPLE_PHOTOS = [
  { label: 'Arduino / Kit', url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80' },
  { label: 'Livro / Stewart', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Jaleco / Saúde', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80' },
  { label: 'Monitor / Tech', url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80' },
  { label: 'Cadeira / Móvel', url: 'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?auto=format&fit=crop&w=800&q=80' },
];

const INPUT_BASE =
  'w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border text-sm focus:outline-none focus:ring-2 focus:ring-[#473469]';
const SELLER_INPUT_BASE = 'px-3 py-2 rounded-xl bg-gray-50 border text-xs';
const LABEL = 'block text-xs font-bold text-[#473469] uppercase mb-1';

const FieldError: React.FC<{ id: string; message?: string }> = ({ id, message }) =>
  message ? (
    <p id={id} role="alert" className="text-[11px] text-[#E25B78] font-semibold mt-1">
      {message}
    </p>
  ) : null;

export const NewItemModal: React.FC<NewItemModalProps> = ({ onClose, onAddItem }) => {
  const [values, setValues] = useState<NewItemFormValues>(() => {
    const seller = loadSellerProfile();
    return {
      title: '',
      description: '',
      price: '',
      isDonation: false,
      category: ITEM_CATEGORIES[0],
      condition: 'Seminovo',
      location: UNIFOR_BLOCOS[0],
      imageUrl: '',
      sellerName: seller.name,
      sellerCourse: seller.course,
      sellerWhatsapp: seller.whatsapp,
    };
  });
  const [errors, setErrors] = useState<NewItemFormErrors>({});

  const update = <K extends keyof NewItemFormValues>(key: K, value: NewItemFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Ao editar um campo, o erro dele some (volta se ainda estiver errado no próximo envio).
    if (key in errors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as NewItemFormField];
        return next;
      });
    }
  };

  const borderFor = (field: NewItemFormField) =>
    errors[field] ? 'border-[#E25B78]' : 'border-gray-200';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateNewItemForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    saveSellerProfile({
      name: values.sellerName.trim(),
      course: values.sellerCourse.trim(),
      whatsapp: values.sellerWhatsapp.trim(),
    });
    onAddItem(buildItemFromForm(values));
    onClose();
  };

  return (
    <Modal
      onClose={onClose}
      labelledBy="new-item-title"
      closeOnBackdrop={false}
      panelClassName="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#AE8FBA]/30 relative my-6"
    >
      {/* Header */}
      <div className="bg-[#473469] text-white p-5 rounded-t-3xl flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-[#F79EB1] text-[#473469] flex items-center justify-center font-black text-lg">
            +
          </div>
          <div>
            <h2 id="new-item-title" className="text-lg font-bold text-[#F2E7D2]">Desapegar de um Item</h2>
            <p className="text-xs text-[#AE8FBA]">Anuncie para milhares de alunos da UNIFOR</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form (noValidate: as mensagens de erro são nossas, em português) */}
      <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">

        {/* Donation Toggle Banner */}
        <button
          type="button"
          role="switch"
          aria-checked={values.isDonation}
          onClick={() => {
            update('isDonation', !values.isDonation);
            if (!values.isDonation) update('price', '');
          }}
          className={`w-full text-left cursor-pointer p-3.5 rounded-2xl border transition flex items-center justify-between ${
            values.isDonation
              ? 'bg-[#ECFDF5] border-[#10B981] text-[#047857]'
              : 'bg-[#F8F7FA] border-[#AE8FBA]/30 text-[#473469] hover:bg-[#F2E7D2]/50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${values.isDonation ? 'bg-[#10B981] text-white' : 'bg-[#AE8FBA]/20 text-[#473469]'}`}>
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Marcar como Doação Grátis 🎁</p>
              <p className="text-xs opacity-80">Ganha destaque com selo verde e engajamento rápido</p>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${values.isDonation ? 'border-[#10B981] bg-[#10B981]' : 'border-gray-300'}`}>
            {values.isDonation && <Check className="w-4 h-4 text-white" />}
          </div>
        </button>

        {/* Item Title */}
        <div>
          <label htmlFor="new-item-title-input" className={LABEL}>
            Título do Anúncio *
          </label>
          <input
            id="new-item-title-input"
            type="text"
            placeholder="Ex: Kit Arduino Uno + Sensores ou Livro Cálculo Stewart"
            value={values.title}
            onChange={(e) => update('title', e.target.value)}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'err-title' : undefined}
            className={`${INPUT_BASE} ${borderFor('title')}`}
          />
          <FieldError id="err-title" message={errors.title} />
        </div>

        {/* Category & Condition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="new-item-category" className={LABEL}>
              Categoria
            </label>
            <select
              id="new-item-category"
              value={values.category}
              onChange={(e) => update('category', e.target.value as ItemCategory)}
              className={`${INPUT_BASE} border-gray-200`}
            >
              {ITEM_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="new-item-condition" className={LABEL}>
              Estado de Conservação
            </label>
            <select
              id="new-item-condition"
              value={values.condition}
              onChange={(e) => update('condition', e.target.value as ItemCondition)}
              className={`${INPUT_BASE} border-gray-200`}
            >
              {ITEM_CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price & Bloco UNIFOR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="new-item-price" className={LABEL}>
              Preço (R$)
            </label>
            <input
              id="new-item-price"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              disabled={values.isDonation}
              placeholder={values.isDonation ? 'R$ 0,00 (Doação)' : 'Ex: 45'}
              value={values.isDonation ? '' : values.price}
              onChange={(e) => update('price', e.target.value)}
              aria-invalid={!!errors.price}
              aria-describedby={errors.price ? 'err-price' : undefined}
              className={`${INPUT_BASE} ${borderFor('price')} disabled:opacity-60 font-semibold text-[#10B981]`}
            />
            <FieldError id="err-price" message={errors.price} />
          </div>

          <div>
            <label htmlFor="new-item-location" className={LABEL}>
              Bloco de Entrega UNIFOR
            </label>
            <select
              id="new-item-location"
              value={values.location}
              onChange={(e) => update('location', e.target.value as UniforBloco)}
              className={`${INPUT_BASE} border-gray-200`}
            >
              {UNIFOR_BLOCOS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="new-item-description" className={LABEL}>
            Descrição do Item
          </label>
          <textarea
            id="new-item-description"
            rows={3}
            placeholder="Descreva detalhes como estado, o que acompanha, ano do livro, motivo da venda..."
            value={values.description}
            onChange={(e) => update('description', e.target.value)}
            className={`${INPUT_BASE} border-gray-200`}
          />
        </div>

        {/* Image URL & Presets */}
        <div>
          <label htmlFor="new-item-image" className={LABEL}>
            URL da Imagem ou Escolha um Exemplo
          </label>
          <input
            id="new-item-image"
            type="text"
            placeholder="Cole o link da foto (https://...)"
            value={values.imageUrl}
            onChange={(e) => update('imageUrl', e.target.value)}
            aria-invalid={!!errors.imageUrl}
            aria-describedby={errors.imageUrl ? 'err-image' : undefined}
            className={`${INPUT_BASE} ${borderFor('imageUrl')} mb-2`}
          />
          <FieldError id="err-image" message={errors.imageUrl} />
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-[10px] text-gray-500 font-semibold whitespace-nowrap">Modelos rápidos:</span>
            {PRESET_SAMPLE_PHOTOS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => update('imageUrl', preset.url)}
                className="text-[10px] bg-[#F2E7D2] hover:bg-[#AE8FBA] hover:text-white text-[#473469] px-2 py-0.5 rounded-md font-medium whitespace-nowrap transition"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Seller Details */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs font-bold text-[#4C5E91] uppercase mb-2">Dados do Vendedor (Sua Identidade)</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <input
                type="text"
                aria-label="Seu nome"
                placeholder="Seu Nome *"
                value={values.sellerName}
                onChange={(e) => update('sellerName', e.target.value)}
                aria-invalid={!!errors.sellerName}
                aria-describedby={errors.sellerName ? 'err-seller-name' : undefined}
                className={`w-full ${SELLER_INPUT_BASE} ${borderFor('sellerName')}`}
              />
              <FieldError id="err-seller-name" message={errors.sellerName} />
            </div>
            <div>
              <input
                type="text"
                aria-label="Seu curso"
                placeholder="Seu Curso * (ex: Ciência da Computação)"
                value={values.sellerCourse}
                onChange={(e) => update('sellerCourse', e.target.value)}
                aria-invalid={!!errors.sellerCourse}
                aria-describedby={errors.sellerCourse ? 'err-seller-course' : undefined}
                className={`w-full ${SELLER_INPUT_BASE} ${borderFor('sellerCourse')}`}
              />
              <FieldError id="err-seller-course" message={errors.sellerCourse} />
            </div>
            <div>
              <input
                type="tel"
                inputMode="tel"
                aria-label="Seu WhatsApp"
                placeholder="WhatsApp * (ex: 85999887766)"
                value={values.sellerWhatsapp}
                onChange={(e) => update('sellerWhatsapp', e.target.value)}
                aria-invalid={!!errors.sellerWhatsapp}
                aria-describedby={errors.sellerWhatsapp ? 'err-seller-whatsapp' : undefined}
                className={`w-full ${SELLER_INPUT_BASE} ${borderFor('sellerWhatsapp')} font-semibold text-[#10B981]`}
              />
              <FieldError id="err-seller-whatsapp" message={errors.sellerWhatsapp} />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#473469] hover:bg-[#352552] text-[#F2E7D2] font-extrabold text-sm rounded-2xl shadow-md transition transform active:scale-98"
          >
            Publicar no UniDesapego ✨
          </button>
        </div>

      </form>
    </Modal>
  );
};

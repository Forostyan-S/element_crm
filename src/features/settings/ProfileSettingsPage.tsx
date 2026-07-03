import { useState } from 'react';
import { Camera, Check } from 'lucide-react';
import { useStore } from '../../store';
import { FormPageShell } from '../../ui';

interface ProfileSettingsPageProps {
  onBack: () => void;
  onSaved?: () => void;
}

export function ProfileSettingsPage({ onBack, onSaved }: ProfileSettingsPageProps) {
  const { user, setUser } = useStore();

  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.name?.split(' ')[1] || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [companyName, setCompanyName] = useState(user?.company || '');
  const [city, setCity] = useState(user?.city || '');
  const [address, setAddress] = useState(user?.address || '');
  const [darkTheme, setDarkTheme] = useState(true);
  const [textSize, setTextSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [vibration, setVibration] = useState(true);

  const getInitials = () => {
    const n = `${firstName} ${lastName}`.trim();
    return n.split(' ').map((s) => s[0]).join('').toUpperCase().slice(0, 2) || '?';
  };

  const handleSave = () => {
    setUser({
      ...user!,
      name: `${firstName} ${lastName}`.trim(),
      phone,
      email,
      company: companyName,
      city,
      address,
    });
    onSaved?.();
    onBack();
  };

  const footer = (
    <button
      onClick={handleSave}
      className="w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-1.5"
      style={{ background: '#3B82F6' }}
    >
      <Check className="w-4 h-4" />
      Сохранить изменения
    </button>
  );

  const inputStyle = { background: '#222938', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9' } as const;

  return (
    <FormPageShell title="Профиль" onBack={onBack} footer={footer}>
      <div className="space-y-6">
        {/* Основная информация */}
        <div>
          <h3 className="text-xs font-semibold text-muted-weak mb-3 uppercase tracking-wider">Основная информация</h3>
          <div className="rounded-card p-4 space-y-4" style={{ background: '#1B2130', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}>
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-2xl font-semibold text-white">{getInitials()}</span>
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-card-elevated flex items-center justify-center" style={{ border: '2px solid #0F1115' }}>
                  <Camera className="w-3.5 h-3.5 text-muted" />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Фото профиля</p>
                <p className="text-xs text-muted-weak">Нажмите чтобы изменить</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-weak mb-1.5 block">Имя</label>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Иван" className="w-full px-3 py-2.5 rounded-xl text-sm" style={inputStyle} />
              </div>
              <div>
                <label className="text-xs text-muted-weak mb-1.5 block">Фамилия</label>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Иванов" className="w-full px-3 py-2.5 rounded-xl text-sm" style={inputStyle} />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-weak mb-1.5 block">Телефон</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 999 123-45-67" className="w-full px-3 py-2.5 rounded-xl text-sm" style={inputStyle} />
            </div>
            <div>
              <label className="text-xs text-muted-weak mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ivan@example.com" className="w-full px-3 py-2.5 rounded-xl text-sm" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Компания */}
        <div>
          <h3 className="text-xs font-semibold text-muted-weak mb-3 uppercase tracking-wider">Компания</h3>
          <div className="rounded-card p-4 space-y-4" style={{ background: '#1B2130', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-card-elevated flex items-center justify-center">
                <span className="text-xl font-bold text-muted">{companyName ? companyName[0].toUpperCase() : '?'}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Логотип</p>
                <p className="text-xs text-muted-weak">Нажмите чтобы загрузить</p>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-weak mb-1.5 block">Название компании</label>
              <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="ЭлектроМонтаж" className="w-full px-3 py-2.5 rounded-xl text-sm" style={inputStyle} />
            </div>
            <div>
              <label className="text-xs text-muted-weak mb-1.5 block">Город</label>
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Москва" className="w-full px-3 py-2.5 rounded-xl text-sm" style={inputStyle} />
            </div>
            <div>
              <label className="text-xs text-muted-weak mb-1.5 block">Адрес</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="ул. Ленина, 1" className="w-full px-3 py-2.5 rounded-xl text-sm" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Интерфейс */}
        <div>
          <h3 className="text-xs font-semibold text-muted-weak mb-3 uppercase tracking-wider">Интерфейс</h3>
          <div className="rounded-card overflow-hidden" style={{ background: '#1B2130', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}>
            <div className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-sm font-medium text-foreground">Темная тема</p>
                <p className="text-xs text-muted-weak">Всегда включена</p>
              </div>
              <button className="relative w-12 h-6 rounded-full transition-colors bg-success">
                <div className="absolute w-5 h-5 rounded-full bg-white shadow-md top-0.5" style={{ left: '26px' }} />
              </button>
            </div>
            <div className="border-t border-border px-4 py-3.5">
              <p className="text-sm font-medium text-foreground mb-2">Размер текста</p>
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setTextSize(size)}
                    className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: textSize === size ? '#3B82F6' : 'rgba(255,255,255,0.03)',
                      color: textSize === size ? '#FFFFFF' : '#94A3B8',
                      border: textSize === size ? 'none' : '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {size === 'small' ? 'Малый' : size === 'medium' ? 'Средний' : 'Крупный'}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-border flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-sm font-medium text-foreground">Вибрация</p>
                <p className="text-xs text-muted-weak">При нажатиях и уведомлениях</p>
              </div>
              <button onClick={() => setVibration(!vibration)} className={`relative w-12 h-6 rounded-full transition-colors ${vibration ? 'bg-success' : 'bg-card-elevated'}`}>
                <div className="absolute w-5 h-5 rounded-full bg-white shadow-md top-0.5 transition-all" style={{ left: vibration ? '26px' : '2px' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </FormPageShell>
  );
}

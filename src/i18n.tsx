import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Lang = 'kk' | 'ru' | 'en';

const en = {
  tagline: 'Turn waste into value',
  login: 'Log in', signup: 'Sign up',
  standard: 'Standard', temporary: 'Temporary',
  iinBin: 'IIN / BIN', iin: 'IIN', bin: 'BIN',
  password: 'Password', systemId: 'System ID',
  scanFingerprint: 'Scan fingerprint', egovLogin: 'Continue with eGov',
  noAccount: 'No account yet?', haveAccount: 'Already registered?',
  accountType: 'Account type',
  individual: 'Individual', government: 'Government organization', business: 'Business', ngo: 'Non-profit (NGO)',
  regMethod: 'How do you want to register?',
  methodStandard: 'With IIN / BIN', methodStandardHint: 'Verified through eGov',
  methodTemp: 'Temporary account', methodTempHint: 'No documents or phone? Valid for 2 years',
  next: 'Continue', back: 'Back',
  fullName: 'Full name (as you state it)', orgName: 'Organization name',
  createAccount: 'Create account', verifying: 'Verifying with eGov…',
  errId: 'Enter a valid 12-digit {label}', errPassword: 'At least 8 characters', errName: 'Enter a name',
  errExists: 'An account with this number already exists', errCreds: 'Wrong IIN/BIN or password',
  errSysId: 'System ID not found', errBio: 'Fingerprint not recognized',
  welcome: 'Welcome', yourId: 'Your system ID', tempStatus: 'Temporary account',
  daysLeft: '{n} days left to verify', logout: 'Log out',
  filterOpen: 'Open now', filterClosed: 'Closed', filterAll: 'All points',
  getDirections: 'Get directions', tariffs: 'Accepted fractions', call: 'Call',
  statusOpen: 'Open', statusBreak: 'On break', statusClosed: 'Closed',
  network: 'Network', stationsLive: '{n} of {total} stations live',
nextStation: 'Add next city', allStationsLive: 'All stations added', resetMap: 'Reset',


};
type Dict = typeof en;

const ru: Dict = {
  tagline: 'Превращайте отходы в пользу',
  login: 'Войти', signup: 'Регистрация',
  standard: 'Стандартный', temporary: 'Временный',
  iinBin: 'ИИН / БИН', iin: 'ИИН', bin: 'БИН',
  password: 'Пароль', systemId: 'Системный ID',
  scanFingerprint: 'Сканировать отпечаток', egovLogin: 'Продолжить через eGov',
  noAccount: 'Нет аккаунта?', haveAccount: 'Уже зарегистрированы?',
  accountType: 'Тип аккаунта',
  individual: 'Физическое лицо', government: 'Госорганизация', business: 'Бизнес', ngo: 'НКО',
  regMethod: 'Как вы хотите зарегистрироваться?',
  methodStandard: 'По ИИН / БИН', methodStandardHint: 'Проверка через eGov',
  methodTemp: 'Временный аккаунт', methodTempHint: 'Нет документов или телефона? Действует 2 года',
  next: 'Продолжить', back: 'Назад',
  fullName: 'ФИО (как вы назвали)', orgName: 'Название организации',
  createAccount: 'Создать аккаунт', verifying: 'Проверка через eGov…',
  errId: 'Введите корректный {label} из 12 цифр', errPassword: 'Не менее 8 символов', errName: 'Укажите имя',
  errExists: 'Аккаунт с таким номером уже существует', errCreds: 'Неверный ИИН/БИН или пароль',
  errSysId: 'Системный ID не найден', errBio: 'Отпечаток не распознан',
  welcome: 'Добро пожаловать', yourId: 'Ваш системный ID', tempStatus: 'Временный аккаунт',
  daysLeft: 'Дней до верификации: {n}', logout: 'Выйти',
  filterOpen: 'Открыто сейчас', filterClosed: 'Закрыто', filterAll: 'Все пункты',
  getDirections: 'Проложить маршрут', tariffs: 'Принимаемые фракции', call: 'Позвонить',
  statusOpen: 'Открыто', statusBreak: 'Перерыв', statusClosed: 'Закрыто',
  network: 'Сеть', stationsLive: 'Станций запущено: {n} из {total}',
nextStation: 'Добавить следующий город', allStationsLive: 'Все станции добавлены', resetMap: 'Сбросить',


};

const kk: Dict = {
  tagline: 'Қалдықты пайдаға айналдырыңыз',
  login: 'Кіру', signup: 'Тіркелу',
  standard: 'Стандартты', temporary: 'Уақытша',
  iinBin: 'ЖСН / БСН', iin: 'ЖСН', bin: 'БСН',
  password: 'Құпиясөз', systemId: 'Жүйелік ID',
  scanFingerprint: 'Саусақ ізін сканерлеу', egovLogin: 'eGov арқылы жалғастыру',
  noAccount: 'Аккаунтыңыз жоқ па?', haveAccount: 'Тіркеліп қойдыңыз ба?',
  accountType: 'Аккаунт түрі',
  individual: 'Жеке тұлға', government: 'Мемлекеттік ұйым', business: 'Бизнес', ngo: 'Коммерциялық емес ұйым',
  regMethod: 'Қалай тіркелгіңіз келеді?',
  methodStandard: 'ЖСН / БСН арқылы', methodStandardHint: 'eGov арқылы тексеріледі',
  methodTemp: 'Уақытша аккаунт', methodTempHint: 'Құжат не телефон жоқ па? 2 жыл жарамды',
  next: 'Жалғастыру', back: 'Артқа',
  fullName: 'Аты-жөні (өзіңіз айтқандай)', orgName: 'Ұйым атауы',
  createAccount: 'Аккаунт құру', verifying: 'eGov арқылы тексерілуде…',
  errId: '12 таңбалы дұрыс {label} енгізіңіз', errPassword: 'Кемінде 8 таңба', errName: 'Атын енгізіңіз',
  errExists: 'Мұндай нөмірмен аккаунт бар', errCreds: 'ЖСН/БСН немесе құпиясөз қате',
  errSysId: 'Жүйелік ID табылмады', errBio: 'Саусақ ізі танылмады',
  welcome: 'Қош келдіңіз', yourId: 'Сіздің жүйелік ID', tempStatus: 'Уақытша аккаунт',
  daysLeft: 'Верификацияға қалған күн: {n}', logout: 'Шығу',
  filterOpen: 'Қазір ашық', filterClosed: 'Жабық', filterAll: 'Барлық пункттер',
  getDirections: 'Бағыт салу', tariffs: 'Қабылданатын фракциялар', call: 'Қоңырау шалу',
  statusOpen: 'Ашық', statusBreak: 'Үзіліс', statusClosed: 'Жабық',
  network: 'Желі', stationsLive: 'Қосылған станциялар: {n} / {total}',
nextStation: 'Келесі қаланы қосу', allStationsLive: 'Барлық станциялар қосылды', resetMap: 'Қайта бастау',


};

const dicts: Record<Lang, Dict> = { en, ru, kk };
export type TKey = keyof Dict;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: TKey, vars?: Record<string, string | number>) => string };
const I18nContext = createContext<Ctx>(null as unknown as Ctx);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  useEffect(() => {
    AsyncStorage.getItem('gt_lang').then((v) => v && setLangState(v as Lang));
  }, []);
  const setLang = (l: Lang) => { setLangState(l); AsyncStorage.setItem('gt_lang', l); };
  const t: Ctx['t'] = (k, vars) => {
    let s = dicts[lang][k];
    if (vars) for (const [name, val] of Object.entries(vars)) s = s.replace(`{${name}}`, String(val));
    return s;
  };
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}
export const useI18n = () => useContext(I18nContext);

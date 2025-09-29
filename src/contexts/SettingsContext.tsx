import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PDFSettings {
  watermark: {
    enabled: boolean;
    opacity: number; // 0 a 1
    size: number; // tamanho em pixels
    position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  };
  header: {
    companyName: {
      fontSize: number;
      fontWeight: 'normal' | 'bold';
      color: string; // hex color
    };
    backgroundColor: string; // hex color
    height: number; // altura do cabeçalho
  };
  company: {
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    cnpj: string;
    ie: string;
  };
}

export interface ProductSettings {
  categories: string[];
  units: string[];
  stockAlerts: {
    enabled: boolean;
    lowStockThreshold: number; // percentual do estoque mínimo
    criticalStockThreshold: number; // percentual do estoque mínimo
    emailNotifications: boolean;
  };
  pricing: {
    defaultProfitMargin: number; // percentual padrão de margem de lucro
    autoCalculateSalePrice: boolean;
    roundPrices: boolean;
    roundingRule: 'up' | 'down' | 'nearest'; // regra de arredondamento
  };
  display: {
    showCostPrice: boolean; // mostrar preço de custo na listagem
    showProfitMargin: boolean; // mostrar margem de lucro
    defaultView: 'grid' | 'list'; // visualização padrão
    itemsPerPage: number;
  };
  validation: {
    requireDescription: boolean;
    requireSupplier: boolean; // para materiais brutos
    minimumStockRequired: boolean;
    allowNegativeStock: boolean;
  };
}
interface SettingsContextType {
  pdfSettings: PDFSettings;
  productSettings: ProductSettings;
  updatePDFSettings: (settings: Partial<PDFSettings>) => void;
  updateProductSettings: (settings: Partial<ProductSettings>) => void;
  resetPDFSettings: () => void;
  resetProductSettings: () => void;
  addProductCategory: (category: string) => void;
  removeProductCategory: (category: string) => void;
  addProductUnit: (unit: string) => void;
  removeProductUnit: (unit: string) => void;
}

const defaultPDFSettings: PDFSettings = {
  watermark: {
    enabled: true,
    opacity: 0.08,
    size: 80,
    position: 'center'
  },
  header: {
    companyName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    backgroundColor: '#4682B4',
    height: 35
  },
  company: {
    name: 'CARNEVALLI ESQUADRIAS LTDA',
    address: 'BUARQUE DE MACEDO, 2735 - PAVILHÃO - CENTRO',
    city: 'Nova Prata - RS - CEP: 95320-000',
    phone: '(54) 3242-2072',
    email: 'carnevalli.esquadrias@gmail.com',
    cnpj: '88.235.288/0001-24',
    ie: '0850011930'
  }
};

const defaultProductSettings: ProductSettings = {
  categories: [
    'Painéis', 'Ferragens', 'Madeiras', 'Vernizes', 'Colas', 'Parafusos', 
    'Portas', 'Gavetas', 'Prateleiras', 'Estruturas', 'Acessórios', 'Outros'
  ],
  units: ['UN', 'M', 'M²', 'M³', 'KG', 'L', 'PC', 'CX', 'PCT', 'ML'],
  stockAlerts: {
    enabled: true,
    lowStockThreshold: 20, // 20% do estoque mínimo
    criticalStockThreshold: 10, // 10% do estoque mínimo
    emailNotifications: false
  },
  pricing: {
    defaultProfitMargin: 30,
    autoCalculateSalePrice: true,
    roundPrices: true,
    roundingRule: 'up'
  },
  display: {
    showCostPrice: true,
    showProfitMargin: true,
    defaultView: 'grid',
    itemsPerPage: 12
  },
  validation: {
    requireDescription: true,
    requireSupplier: false,
    minimumStockRequired: true,
    allowNegativeStock: false
  }
};
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pdfSettings, setPdfSettings] = useState<PDFSettings>(defaultPDFSettings);
  const [productSettings, setProductSettings] = useState<ProductSettings>(defaultProductSettings);

  // Carregar configurações do localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('pdfSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setPdfSettings({ ...defaultPDFSettings, ...parsed });
      } catch (error) {
        console.error('Erro ao carregar configurações do PDF:', error);
      }
    }

    const savedProductSettings = localStorage.getItem('productSettings');
    if (savedProductSettings) {
      try {
        const parsed = JSON.parse(savedProductSettings);
        setProductSettings({ ...defaultProductSettings, ...parsed });
      } catch (error) {
        console.error('Erro ao carregar configurações de produtos:', error);
      }
    }
  }, []);

  // Salvar configurações no localStorage
  useEffect(() => {
    localStorage.setItem('pdfSettings', JSON.stringify(pdfSettings));
  }, [pdfSettings]);

  useEffect(() => {
    localStorage.setItem('productSettings', JSON.stringify(productSettings));
  }, [productSettings]);
  const updatePDFSettings = (newSettings: Partial<PDFSettings>) => {
    setPdfSettings(prev => ({
      ...prev,
      ...newSettings,
      watermark: { ...prev.watermark, ...newSettings.watermark },
      header: { 
        ...prev.header, 
        ...newSettings.header,
        companyName: { ...prev.header.companyName, ...newSettings.header?.companyName }
      },
      company: { ...prev.company, ...newSettings.company }
    }));
  };

  const updateProductSettings = (newSettings: Partial<ProductSettings>) => {
    setProductSettings(prev => ({
      ...prev,
      ...newSettings,
      stockAlerts: { ...prev.stockAlerts, ...newSettings.stockAlerts },
      pricing: { ...prev.pricing, ...newSettings.pricing },
      display: { ...prev.display, ...newSettings.display },
      validation: { ...prev.validation, ...newSettings.validation }
    }));
  };
  const resetPDFSettings = () => {
    setPdfSettings(defaultPDFSettings);
    localStorage.removeItem('pdfSettings');
  };

  const resetProductSettings = () => {
    setProductSettings(defaultProductSettings);
    localStorage.removeItem('productSettings');
  };

  const addProductCategory = (category: string) => {
    if (!productSettings.categories.includes(category)) {
      setProductSettings(prev => ({
        ...prev,
        categories: [...prev.categories, category].sort()
      }));
    }
  };

  const removeProductCategory = (category: string) => {
    setProductSettings(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  const addProductUnit = (unit: string) => {
    if (!productSettings.units.includes(unit)) {
      setProductSettings(prev => ({
        ...prev,
        units: [...prev.units, unit].sort()
      }));
    }
  };

  const removeProductUnit = (unit: string) => {
    setProductSettings(prev => ({
      ...prev,
      units: prev.units.filter(u => u !== unit)
    }));
  };
  return (
    <SettingsContext.Provider value={{
      pdfSettings,
      productSettings,
      updatePDFSettings,
      updateProductSettings,
      resetPDFSettings
      resetProductSettings,
      addProductCategory,
      removeProductCategory,
      addProductUnit,
      removeProductUnit
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
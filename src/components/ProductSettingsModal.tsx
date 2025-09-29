import React, { useState } from 'react';
import { X, Package, Tag, AlertTriangle, DollarSign, Eye, Shield, Plus, Trash2, RotateCcw } from 'lucide-react';
import { useSettings, ProductSettings } from '../contexts/SettingsContext';

interface ProductSettingsModalProps {
  onClose: () => void;
}

const ProductSettingsModal: React.FC<ProductSettingsModalProps> = ({ onClose }) => {
  const { 
    productSettings, 
    updateProductSettings, 
    resetProductSettings,
    addProductCategory,
    removeProductCategory,
    addProductUnit,
    removeProductUnit
  } = useSettings();
  
  const [activeTab, setActiveTab] = useState<'categories' | 'alerts' | 'pricing' | 'display' | 'validation'>('categories');
  const [newCategory, setNewCategory] = useState('');
  const [newUnit, setNewUnit] = useState('');

  const handleStockAlertsChange = (field: keyof ProductSettings['stockAlerts'], value: any) => {
    updateProductSettings({
      stockAlerts: {
        ...productSettings.stockAlerts,
        [field]: value
      }
    });
  };

  const handlePricingChange = (field: keyof ProductSettings['pricing'], value: any) => {
    updateProductSettings({
      pricing: {
        ...productSettings.pricing,
        [field]: value
      }
    });
  };

  const handleDisplayChange = (field: keyof ProductSettings['display'], value: any) => {
    updateProductSettings({
      display: {
        ...productSettings.display,
        [field]: value
      }
    });
  };

  const handleValidationChange = (field: keyof ProductSettings['validation'], value: any) => {
    updateProductSettings({
      validation: {
        ...productSettings.validation,
        [field]: value
      }
    });
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addProductCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleAddUnit = () => {
    if (newUnit.trim()) {
      addProductUnit(newUnit.trim());
      setNewUnit('');
    }
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      resetProductSettings();
    }
  };

  const tabs = [
    { id: 'categories', label: 'Categorias & Unidades', icon: Tag },
    { id: 'alerts', label: 'Alertas de Estoque', icon: AlertTriangle },
    { id: 'pricing', label: 'Precificação', icon: DollarSign },
    { id: 'display', label: 'Exibição', icon: Eye },
    { id: 'validation', label: 'Validações', icon: Shield }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-xl">
          <h2 className="text-2xl font-bold flex items-center">
            <Package className="h-6 w-6 mr-2" />
            Configurações de Produtos e Estoque
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={handleReset}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              title="Restaurar padrões"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar com abas */}
          <div className="w-64 bg-gray-50 border-r border-gray-200">
            <div className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium text-sm">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Conteúdo das abas */}
          <div className="flex-1 p-6">
            {activeTab === 'categories' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Categorias e Unidades de Medida</h3>
                
                {/* Categorias */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Categorias de Produtos</h4>
                  <div className="flex space-x-2 mb-4">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Nova categoria..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                    <button
                      onClick={handleAddCategory}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Adicionar</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {productSettings.categories.map((category) => (
                      <div key={category} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg">
                        <span className="text-sm">{category}</span>
                        <button
                          onClick={() => removeProductCategory(category)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Unidades */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Unidades de Medida</h4>
                  <div className="flex space-x-2 mb-4">
                    <input
                      type="text"
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      placeholder="Nova unidade..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddUnit()}
                    />
                    <button
                      onClick={handleAddUnit}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Adicionar</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {productSettings.units.map((unit) => (
                      <div key={unit} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg">
                        <span className="text-sm font-mono">{unit}</span>
                        <button
                          onClick={() => removeProductUnit(unit)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'alerts' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Configurações de Alertas de Estoque</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={productSettings.stockAlerts.enabled}
                      onChange={(e) => handleStockAlertsChange('enabled', e.target.checked)}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-medium text-gray-700">Habilitar alertas de estoque</span>
                  </label>

                  {productSettings.stockAlerts.enabled && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Limite para Estoque Baixo: {productSettings.stockAlerts.lowStockThreshold}%
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="50"
                          step="5"
                          value={productSettings.stockAlerts.lowStockThreshold}
                          onChange={(e) => handleStockAlertsChange('lowStockThreshold', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>10%</span>
                          <span>50%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Alerta quando o estoque estiver abaixo de {productSettings.stockAlerts.lowStockThreshold}% do estoque mínimo
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Limite para Estoque Crítico: {productSettings.stockAlerts.criticalStockThreshold}%
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="25"
                          step="5"
                          value={productSettings.stockAlerts.criticalStockThreshold}
                          onChange={(e) => handleStockAlertsChange('criticalStockThreshold', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>5%</span>
                          <span>25%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Alerta crítico quando o estoque estiver abaixo de {productSettings.stockAlerts.criticalStockThreshold}% do estoque mínimo
                        </p>
                      </div>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={productSettings.stockAlerts.emailNotifications}
                          onChange={(e) => handleStockAlertsChange('emailNotifications', e.target.checked)}
                          className="text-amber-600 focus:ring-amber-500"
                        />
                        <span className="font-medium text-gray-700">Enviar notificações por email</span>
                      </label>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Configurações de Precificação</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Margem de Lucro Padrão: {productSettings.pricing.defaultProfitMargin}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={productSettings.pricing.defaultProfitMargin}
                      onChange={(e) => handlePricingChange('defaultProfitMargin', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>10%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={productSettings.pricing.autoCalculateSalePrice}
                      onChange={(e) => handlePricingChange('autoCalculateSalePrice', e.target.checked)}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-medium text-gray-700">Calcular preço de venda automaticamente</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={productSettings.pricing.roundPrices}
                      onChange={(e) => handlePricingChange('roundPrices', e.target.checked)}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-medium text-gray-700">Arredondar preços</span>
                  </label>

                  {productSettings.pricing.roundPrices && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Regra de Arredondamento
                      </label>
                      <select
                        value={productSettings.pricing.roundingRule}
                        onChange={(e) => handlePricingChange('roundingRule', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="up">Para cima</option>
                        <option value="down">Para baixo</option>
                        <option value="nearest">Mais próximo</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'display' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Configurações de Exibição</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={productSettings.display.showCostPrice}
                      onChange={(e) => handleDisplayChange('showCostPrice', e.target.checked)}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-medium text-gray-700">Mostrar preço de custo na listagem</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={productSettings.display.showProfitMargin}
                      onChange={(e) => handleDisplayChange('showProfitMargin', e.target.checked)}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-medium text-gray-700">Mostrar margem de lucro</span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visualização Padrão
                    </label>
                    <select
                      value={productSettings.display.defaultView}
                      onChange={(e) => handleDisplayChange('defaultView', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="grid">Grade</option>
                      <option value="list">Lista</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Itens por Página: {productSettings.display.itemsPerPage}
                    </label>
                    <input
                      type="range"
                      min="6"
                      max="24"
                      step="6"
                      value={productSettings.display.itemsPerPage}
                      onChange={(e) => handleDisplayChange('itemsPerPage', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>6</span>
                      <span>12</span>
                      <span>18</span>
                      <span>24</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'validation' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Configurações de Validação</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={productSettings.validation.requireDescription}
                      onChange={(e) => handleValidationChange('requireDescription', e.target.checked)}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-medium text-gray-700">Descrição obrigatória</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={productSettings.validation.requireSupplier}
                      onChange={(e) => handleValidationChange('requireSupplier', e.target.checked)}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-medium text-gray-700">Fornecedor obrigatório (materiais brutos)</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={productSettings.validation.minimumStockRequired}
                      onChange={(e) => handleValidationChange('minimumStockRequired', e.target.checked)}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-medium text-gray-700">Estoque mínimo obrigatório</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={productSettings.validation.allowNegativeStock}
                      onChange={(e) => handleValidationChange('allowNegativeStock', e.target.checked)}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-medium text-gray-700">Permitir estoque negativo</span>
                  </label>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Sobre as Validações</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• <strong>Descrição obrigatória:</strong> Força o preenchimento da descrição do produto</li>
                    <li>• <strong>Fornecedor obrigatório:</strong> Exige fornecedor apenas para materiais brutos</li>
                    <li>• <strong>Estoque mínimo:</strong> Obriga definir um estoque mínimo para alertas</li>
                    <li>• <strong>Estoque negativo:</strong> Permite vendas mesmo sem estoque disponível</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSettingsModal;
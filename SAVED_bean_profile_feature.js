// SAVED BEAN PROFILE FEATURE - Can be re-added later
// This file contains the bean profile selection page and recipe recommendation logic

// ============================================
// 1. CONSTANTS TO ADD (near other constants)
// ============================================
const PROCESSING = ['Washed', 'Natural', 'Honey', 'Anaerobic', 'Other'];
const ROAST_LEVELS = ['Light', 'Medium', 'Dark'];


// ============================================
// 2. STATE TO ADD (in App component)
// ============================================
const [beanProfile, setBeanProfile] = useState({ origin: '', processing: '', roast: '' });


// ============================================
// 3. RECOMMENDATION LOGIC (in App component)
// ============================================
const getRecommendedRecipes = (brewer, profile) => {
  const recipes = RECIPES[brewer] || [];
  if (!profile.origin && !profile.processing && !profile.roast) return [];
  
  return recipes.filter(recipe => {
    const bestFor = (recipe.bestFor || '').toLowerCase();
    let score = 0;
    
    // Check origin match
    if (profile.origin && bestFor.includes(profile.origin.toLowerCase())) score += 2;
    
    // Check processing match
    if (profile.processing) {
      if (bestFor.includes(profile.processing.toLowerCase())) score += 2;
      // Special cases
      if (profile.processing === 'Natural' && bestFor.includes('fruit-forward')) score += 1;
      if (profile.processing === 'Washed' && (bestFor.includes('clean') || bestFor.includes('bright'))) score += 1;
    }
    
    // Check roast match
    if (profile.roast) {
      if (bestFor.includes(profile.roast.toLowerCase())) score += 2;
      if (profile.roast === 'Light' && (bestFor.includes('light') || bestFor.includes('floral') || bestFor.includes('tea-like'))) score += 1;
      if (profile.roast === 'Medium' && bestFor.includes('medium')) score += 1;
    }
    
    return score >= 2;
  }).map(r => r.id);
};


// ============================================
// 4. BEAN PROFILE VIEW COMPONENT
// ============================================
const BeanProfileView = () => {
  const brewer = BREWERS[selectedBrewer];
  const [origin, setOrigin] = useState(beanProfile.origin);
  const [processing, setProcessing] = useState(beanProfile.processing);
  const [roast, setRoast] = useState(beanProfile.roast);

  const handleContinue = () => {
    setBeanProfile({ origin, processing, roast });
    setView('recipe');
  };

  const handleSkip = () => {
    setBeanProfile({ origin: '', processing: '', roast: '' });
    setView('recipe');
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => setView('select')} className="text-gray-500 hover:text-white">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <img src={brewer?.image} alt={brewer?.name} className="w-8 h-8 object-contain" />
          <span className="text-white font-bold text-lg">{brewer?.name}</span>
        </div>
      </div>

      <div className="py-4">
        <h2 className="text-green-400 uppercase tracking-wider blink" style={{fontSize: '0.7rem'}}>» DESCRIBE YOUR BEANS «</h2>
      </div>

      {/* Origin Dropdown */}
      <div className="space-y-2">
        <label className="text-purple-400 text-sm uppercase tracking-wider">ORIGIN</label>
        <div className="relative">
          <select 
            value={origin} 
            onChange={e => setOrigin(e.target.value)}
            className="w-full bg-gray-900 border-4 border-gray-700 px-4 py-4 text-white text-xl focus:border-purple-500 focus:outline-none appearance-none cursor-pointer hover:border-gray-600 transition-colors"
            style={{borderRadius: '0'}}>
            <option value="">Select origin...</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
        </div>
      </div>

      {/* Processing Dropdown */}
      <div className="space-y-2">
        <label className="text-purple-400 text-sm uppercase tracking-wider">PROCESSING</label>
        <div className="relative">
          <select 
            value={processing} 
            onChange={e => setProcessing(e.target.value)}
            className="w-full bg-gray-900 border-4 border-gray-700 px-4 py-4 text-white text-xl focus:border-purple-500 focus:outline-none appearance-none cursor-pointer hover:border-gray-600 transition-colors"
            style={{borderRadius: '0'}}>
            <option value="">Select processing...</option>
            {PROCESSING.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
        </div>
      </div>

      {/* Roast Level */}
      <div className="space-y-2">
        <label className="text-purple-400 text-sm uppercase tracking-wider">ROAST LEVEL</label>
        <div className="grid grid-cols-3 gap-2">
          {ROAST_LEVELS.map(level => (
            <button
              key={level}
              onClick={() => setRoast(roast === level ? '' : level)}
              className={`py-4 text-lg font-bold border-4 transition-all ${
                roast === level 
                  ? 'bg-purple-600 border-purple-400 text-white' 
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
              style={{borderRadius: '0'}}>
              {level.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="pt-4 space-y-3">
        <Button onClick={handleContinue} className="w-full py-4 text-xl">
          FIND RECIPES <ChevronRight className="w-5 h-5" />
        </Button>
        <button 
          onClick={handleSkip}
          className="w-full text-gray-500 hover:text-gray-300 text-lg py-2 transition-colors">
          Skip → Show all recipes
        </button>
      </div>
    </div>
  );
};


// ============================================
// 5. UPDATED SELECT RECIPE VIEW (with recommendations)
// ============================================
const SelectRecipeView = () => {
  const recipes = RECIPES[selectedBrewer] || [];
  const brewer = BREWERS[selectedBrewer];
  const recommendedIds = getRecommendedRecipes(selectedBrewer, beanProfile);
  const hasRecommendations = recommendedIds.length > 0;

  // Sort recipes: recommended first
  const sortedRecipes = [...recipes].sort((a, b) => {
    const aRec = recommendedIds.includes(a.id);
    const bRec = recommendedIds.includes(b.id);
    if (aRec && !bRec) return -1;
    if (!aRec && bRec) return 1;
    return 0;
  });

  return (
    <div className="space-y-5 pb-24">
      <div className="flex items-center gap-3">
        <button onClick={() => setView('beans')} className="text-gray-500 hover:text-white">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <img src={brewer?.image} alt={brewer?.name} className="w-8 h-8 object-contain" />
          <span className="text-white font-bold text-lg">{brewer?.name}</span>
        </div>
      </div>

      {/* Show bean profile summary if set */}
      {hasRecommendations && (
        <div className="bg-gray-900/50 border-2 border-orange-500/30 px-4 py-3" style={{borderRadius: '0'}}>
          <div className="text-orange-400 text-sm mb-1 uppercase tracking-wider">MATCHING YOUR BEANS</div>
          <div className="text-gray-400 text-lg">
            {[beanProfile.origin, beanProfile.processing, beanProfile.roast].filter(Boolean).join(' • ')}
          </div>
        </div>
      )}

      <h2 className="text-green-400 uppercase tracking-wider mb-3 blink" style={{fontSize: '0.7rem'}}>» CHOOSE RECIPE «</h2>
      
      <div className="space-y-3">
        {sortedRecipes.map((recipe) => {
          const isRecommended = recommendedIds.includes(recipe.id);
          return (
            <div 
              key={recipe.id} 
              onClick={() => { setSelectedRecipe(recipe); setView('brew'); }}
              className={`cursor-pointer ${isRecommended ? 'border-animate' : ''}`}>
              <div className={`bg-gray-900 border-4 p-4 transition-all hover:bg-gray-800 active:translate-y-1 ${
                isRecommended ? 'border-orange-500' : 'border-gray-700 hover:border-purple-500'
              }`} style={{borderRadius: '0'}}>
                {isRecommended && (
                  <div className="text-orange-400 text-sm mb-2 uppercase tracking-wider">RECOMMENDED FOR YOUR BEANS</div>
                )}
                {/* ... rest of recipe card content ... */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// ============================================
// 6. FLOW CHANGES
// ============================================
// - Brewer selection goes to 'beans' view instead of 'recipe'
// - Beans view goes to 'recipe' view
// - Recipe back button goes to 'beans' view
// - Add {view === 'beans' && <BeanProfileView />} to main render
// - Update bottom nav to include 'beans' in the brew flow views

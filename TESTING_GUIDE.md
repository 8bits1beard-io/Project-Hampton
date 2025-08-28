# Project Hampton - Testing Guide v0.0.2

## 🚀 Quick Start Testing

### Step 1: Launch the Application
```bash
# Start local server
python -m http.server 8000

# Open in browser
http://localhost:8000/index2.html
```

## ✅ Testing Checklist

### 1. **Initial Load Testing**
- [ ] Page loads without errors
- [ ] Console shows: "🚀 Initializing Project: Hampton v0.0.2"
- [ ] Welcome notification appears
- [ ] Project selection screen is shown
- [ ] No modules show as completed (fresh state)

### 2. **Project Selection Testing**
- [ ] All 3 project cards are visible
- [ ] Hover effects work on project cards
- [ ] Click "Personal Dashboard" → Success notification
- [ ] Click "AI Blog Platform" → Success notification  
- [ ] Click "Automation Bot Suite" → Success notification
- [ ] After selection → Dashboard loads

### 3. **Progress Code Testing**

#### Test Loading a Code:
```javascript
// In browser console, test with this code:
hamptonApp.loadProgress('HAMPTON-DASH-W1M1-TEST-CODE')
```
- [ ] Should show "Invalid progress code" error
- [ ] Valid format but wrong checksum shows error

#### Test Generating a Code:
```javascript
// Click "Progress" in nav or run:
hamptonApp.saveProgress()
```
- [ ] Modal appears with code
- [ ] Code format: HAMPTON-XXXX-W#M#-XXXX-XXXX
- [ ] Copy button works
- [ ] Code copies to clipboard

### 4. **Dashboard Testing**
- [ ] Current week shows (Week 1 initially)
- [ ] Level shows as 1
- [ ] XP shows as 0
- [ ] Streak shows as 0
- [ ] No modules show as completed
- [ ] Week 1 modules are clickable
- [ ] Week 2-8 show as locked

### 5. **Module Interaction Testing**

#### Start a Module:
```javascript
// In console:
startModule(1, 1)  // Start Week 1, Module 1
```
- [ ] Module content loads
- [ ] "Starting: [Module Name]" notification
- [ ] Exercises show as not completed

#### Complete Exercises:
```javascript
// Complete exercises for W1M1
completeExercise(1, 1, 'w1m1e1')
completeExercise(1, 1, 'w1m1e2')
```
- [ ] XP notification appears (+25 XP each)
- [ ] "All exercises complete!" message

#### Complete Module:
```javascript
hamptonApp.completeModule(1, 1)
```
- [ ] "Module completed! +100 XP" notification
- [ ] Module shows as completed (green)
- [ ] Next module becomes available
- [ ] XP and level update

### 6. **Theme Testing**
- [ ] Click sun/moon toggle
- [ ] Dark mode activates properly
- [ ] All text remains readable
- [ ] Toggle back to light mode works

### 7. **Tool Switching Testing**
- [ ] Click "Code Puppy" button
- [ ] Colors change to teal theme
- [ ] Click "Claude Code" button
- [ ] Colors change back to blue theme

### 8. **Navigation Testing**
- [ ] Home link → Project selection
- [ ] Dashboard link → Current dashboard (or project selection if none)
- [ ] Achievements link → Achievements page
- [ ] Progress link → Shows progress code

### 9. **Gamification Testing**

#### Check XP System:
```javascript
// Add XP manually
hamptonApp.progressTracker.addXP(500)
```
- [ ] XP updates in UI
- [ ] Level increases at appropriate thresholds

#### Check Achievements:
```javascript
// View current achievements
hamptonApp.progressTracker.state.achievements
```
- [ ] Achievements unlock at correct times
- [ ] Achievement notifications appear
- [ ] Achievement page shows unlocked/locked properly

### 10. **State Persistence Testing**
1. Complete some modules
2. Generate progress code
3. Refresh page (F5)
4. Check localStorage:
```javascript
localStorage.getItem('hampton_progress')
```
- [ ] Progress persists after refresh
- [ ] Theme preference persists
- [ ] Tool preference persists

### 11. **Error Handling Testing**

#### Test Invalid Actions:
```javascript
// Try to start locked module
startModule(2, 1)  // Should fail if Week 1 not complete
```
- [ ] "Complete previous modules first!" warning

```javascript
// Try to complete module without exercises
hamptonApp.completeModule(1, 2)
```
- [ ] "Complete all exercises first!" warning

### 12. **Mobile Responsive Testing**
- [ ] Open DevTools → Toggle device toolbar
- [ ] Test at 375px (iPhone)
- [ ] Test at 768px (iPad)
- [ ] Navigation collapses properly
- [ ] Cards stack vertically
- [ ] Notifications appear correctly

## 🐛 Debug Commands

Open browser console (F12) and use these commands:

```javascript
// View current state
hamptonApp.progressTracker.state

// Reset everything
resetProgress()

// Skip to week
hamptonApp.progressTracker.state.currentWeek = 3
hamptonApp.showDashboard()

// Add XP
hamptonApp.progressTracker.addXP(1000)

// Unlock achievement manually
hamptonApp.progressTracker.unlockAchievement('first_blood', 'First Blood', 'Your first module!')

// Test notification types
hamptonApp.notifications.success('Success message')
hamptonApp.notifications.error('Error message')
hamptonApp.notifications.warning('Warning message')
hamptonApp.notifications.info('Info message')
hamptonApp.notifications.xp(100)

// Show achievement notification
hamptonApp.notifications.showAchievement({
    name: 'Test Achievement',
    description: 'Testing the achievement system',
    icon: '🏆',
    xp: 200
})
```

## 📝 Expected Initial State

When first loading (no prior progress):
- **Project**: None selected
- **Week**: 0
- **Module**: 0
- **XP**: 0
- **Level**: 1
- **Achievements**: []
- **Completed Modules**: []
- **Daily Streak**: 0

## 🔄 Testing Flow

### Complete User Journey:
1. Load page → Project selection visible
2. Select "Dashboard" project → Dashboard loads
3. Start Week 1, Module 1 → Module content appears
4. Complete 2 exercises → XP gained
5. Complete module → Achievement unlocked
6. Generate progress code → Code displayed
7. Copy code and refresh page
8. Load progress code → State restored
9. Continue to Module 2

## ⚠️ Known Issues to Test

1. **Progress codes** - Ensure encoding/decoding works
2. **Module locking** - Can't skip ahead
3. **XP calculations** - Correct amounts awarded
4. **Achievement timing** - Unlock at right moments
5. **Theme persistence** - Survives refresh
6. **Mobile navigation** - Menu toggles properly

## 🎯 Success Criteria

The application is working correctly when:
- ✅ No console errors on load
- ✅ All interactions provide feedback
- ✅ Progress saves and loads correctly
- ✅ Modules unlock in sequence
- ✅ XP and achievements work
- ✅ Themes and tools switch properly
- ✅ Mobile responsive design works

## 📊 Performance Metrics

Check in DevTools → Network tab:
- Page load: < 2 seconds
- First contentful paint: < 1 second
- Total bundle size: < 500KB
- No failed resource loads

## 🚨 If Something Breaks

1. Check browser console for errors
2. Try `resetProgress()` to clear state
3. Clear localStorage: `localStorage.clear()`
4. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
5. Test in incognito/private window
6. Check that Python server is still running

---

Remember: **index2.html** is the working version, **index.html** is the original mockup!
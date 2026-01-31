# Fash.On UI/UX Audit Report

**Scope**: Frontend Only (Next.js 16, React 19, Tailwind v4, shadcn/ui)
**Date**: 2026-01-31
**Auditor**: AI Code Review

---

## Executive Summary

| Metric | Count |
|--------|-------|
| **Critical UI/UX Issues** | 0 |
| **High Priority UX Issues** | 4 |
| **Medium Priority Issues** | 6 |
| **Visual Improvements Needed** | 12 |
| **Missing Pages (404 Risk)** | 6 |
| **Estimated Completion** | 75% |

**Overall Design Assessment**: **FAIR** - Chức năng đầy đủ nhưng thiết kế visual còn khá "nhàm chán", chưa đạt được cảm giác "sang trọng" của một fashion e-commerce cao cấp. Cần cải thiện nhiều về micro-interactions, color palette, và spacing consistency.

---

## Section 1: Critical UI/UX Issues (Must Fix - Broken/Misleading)

*Không có issue Critical nào được phát hiện trong đợt audit này.*

---

## Section 2: High Priority UX Issues (Confusing/Poor Experience)

### **[UI-HIGH-001]** Feature "Đổi mật khẩu" bị disabled hoàn toàn - User bị confuse
- **Location**: `frontend/src/app/dashboard/page.tsx` (Tab Password)
- **Issue**: Toàn bộ form đổi mật khẩu bị disabled với placeholder "Tính năng đang được phát triển"
- **Impact**: User nhìn thấy UI nhưng không thể tương tác, tạo cảm giác thiếu chuyên nghiệp
- **What needs change**: Nên ẩn hoàn toàn tab này hoặc thay bằng thông báo rõ ràng hơn

### **[UI-HIGH-002]** Footer links dẫn đến trang 404 - Dead links
- **Location**: `frontend/src/components/layout/Footer.tsx`
- **Links broken**: `/guide`, `/return-policy`, `/shipping`, `/about`, `/careers`, `/contact`
- **Impact**: User click vào không có phản hồi, ảnh hưởng đến trustworthiness
- **What needs change**: Hoặc tạo các trang này, hoặc xóa links, hoặc thay bằng external links

### **[UI-HIGH-003]** Tab navigation trong Dashboard thiếu visual feedback rõ ràng
- **Location**: `frontend/src/app/dashboard/page.tsx`
- **Issue**: Tab active và inactive chỉ khác nhau ở background màu đen/trắng, không có indicator rõ ràng
- **Impact**: User khó nhận biết đang ở tab nào, nhất là khi scroll
- **What needs change**: Thêm left border accent, icon highlight, hoặc animation chuyển tab

### **[UI-HIGH-004]** Mobile navigation missing - Không có menu trên mobile
- **Location**: `frontend/src/components/layout/Header.tsx`
- **Issue**: Navigation chỉ có `hidden md:flex`, không có mobile menu alternative
- **Impact**: User trên mobile không thể navigate đến các trang chính (Sản phẩm, Liên hệ)
- **What needs change**: Cần hamburger menu với slide-out drawer cho mobile

---

## Section 3: Visual Design Issues (Needs Improvement - Cần redesign cho đẹp)

### **[UI-VIS-001]** Buttons quá nhỏ và góc quá sắc - Thiếu modern feel
- **Location**: Toàn bộ project (`globals.css`, các page components)
- **Current**: Buttons có `rounded-md` (4px), height chỉ 36-48px, nhìn "cứng"
- **What needs change**: 
  - Tăng border-radius lên 8-12px cho soft, friendly look
  - Tăng height buttons thêm 20% để dễ click hơn
  - Thêm subtle shadow cho depth
  - Primary buttons nên có gradient hoặc hover lift effect

### **[UI-VIS-002]** Color palette quá monochrome - Thiếu điểm nhấn thờI trang
- **Location**: `frontend/src/app/globals.css`, toàn bộ UI
- **Current**: Chủ yếu là neutral-900, neutral-100, black, white - rất "an toàn" nhưng nhàm chán
- **What needs change**:
  - Thêm accent color (ví dụ: rose-500 cho fashion, amber-500 cho luxury)
  - Dùng gradient cho hero sections
  - Category cards nên có color-coded overlays
  - Status badges cần màu sắc rõ ràng hơn

### **[UI-VIS-003]** Product cards tĩnh, thiếu "life" - Cần thêm interactions
- **Location**: `frontend/src/components/product/ProductCard.tsx`
- **Current**: Chỉ có scale ảnh nhẹ khi hover, không có shadow change, không lift effect
- **What needs change**:
  - Card nên "lift up" khi hover (translateY -4px + shadow tăng)
  - Thêm quick action buttons hiện ra khi hover
  - Image zoom smooth hơn (hiện tại hơi giật)
  - Wishlist heart nên có animation "pop" khi click

### **[UI-VIS-004]** Hero banner chưa đủ "wow factor" - Cần thêm visual impact
- **Location**: `frontend/src/components/home/HeroSlider.tsx`, `frontend/src/app/(shop)/page.tsx`
- **Current**: Text centered đơn giản, buttons vuông, không có typography hierarchy mạnh
- **What needs change**:
  - Typography: Heading nên có text-shadow hoặc gradient text
  - Buttons: Thêm glassmorphism effect hoặc border glow
  - Slider: Thêm parallax effect hoặc Ken Burns animation cho ảnh
  - Thêm scroll indicator ở bottom

### **[UI-VIS-005]** Input fields nhìn "bé" và basic - Cần redesign
- **Location**: Login, Register, Checkout, Dashboard forms
- **Current**: Height 36-48px, border mỏng, focus ring không nổi bật
- **What needs change**:
  - Tăng height lên 52-56px cho dễ touch
  - Border-radius 8px cho modern look
  - Focus state: Thêm colored border + subtle glow
  - Floating labels thay vì static labels phía trên
  - Icons bên trong input (prefix) cho context

### **[UI-VIS-006]** Loading skeletons quá "xám" - Cần thêm shimmer/gradient
- **Location**: `frontend/src/components/ui/skeleton.tsx`, các page loading states
- **Current**: Chỉ là `bg-neutral-200` tĩnh với animate-pulse
- **What needs change**:
  - Thêm shimmer gradient animation (wave effect)
  - Skeleton nên match layout chính xác hơn
  - Card skeletons nên có rounded corners giống real cards

### **[UI-VIS-007]** Admin dropdown menu thiếu polish
- **Location**: `frontend/src/components/layout/Header.tsx`
- **Current**: Border đen đơn giản, spacing không đều, shadow yếu
- **What needs change**:
  - Thêm arrow indicator pointing up
  - Border-radius consistency (12px)
  - Better shadow (layered shadows)
  - Smooth fade-in animation
  - Admin button gradient đẹp nhưng cần thêm padding/spacing đều hơn

### **[UI-VIS-008]** Newsletter section quá "plain" - Không thu hút attention
- **Location**: `frontend/src/app/(shop)/page.tsx` (Newsletter section)
- **Current**: Background neutral-100, input và button vuông, không có visual interest
- **What needs change**:
  - Background: Pattern hoặc gradient subtle
  - Input: Rounded-pill shape (full rounded)
  - Button: Cùng style với input (joined/pill shape)
  - Thêm trust indicators ("Hơn 10,000+ người đã đăng ký")
  - Icon hoặc illustration nhỏ

### **[UI-VIS-009]** Category cards cần thêm gradient overlay depth
- **Location**: `frontend/src/components/home/category-card.tsx`
- **Current**: Overlay đen đơn giản `bg-black/30`
- **What needs change**:
  - Gradient overlay từ bottom (đậm ở dưới, nhạt dần lên trên)
  - Text có text-shadow hoặc stroke để đọc tốt trên mọi ảnh
  - Hover effect: Ảnh zoom + overlay tối hơn + text slide up

### **[UI-VIS-010]** Trust badges trong Product Detail bị "chèn ép"
- **Location**: `frontend/src/app/(shop)/products/[slug]/page.tsx`
- **Current**: Icons và text nằm chung một dòng với gap nhỏ, font-size quá nhỏ (text-xs)
- **What needs change**:
  - Tăng icon size và text size
  - Layout: Vertical stack hoặc grid với padding rõ ràng
  - Thêm background subtle hoặc divider rõ hơn
  - Icons có thể có colored background circles

### **[UI-VIS-011]** Cart items thiếu visual separation
- **Location**: `frontend/src/app/cart/page.tsx`
- **Current**: Items chỉ có border mỏng, không có hover state
- **What needs change**:
  - Card-style với shadow nhẹ
  - Hover: Background change hoặc subtle lift
  - Image container có border-radius
  - Quantity stepper nên có visual "buttons" rõ ràng hơn

### **[UI-VIS-012]** Typography hierarchy chưa rõ ràng
- **Location**: Toàn bộ project
- **Current**: Tất cả headings đều là uppercase, tracking-wide, weight-black - thiếu sự phân biệt
- **What needs change**:
  - H1: Có thể giữ uppercase nhưng H2, H3 nên sentence case
  - Body text: Line-height cần tăng thêm (1.6-1.8)
  - Giảm letter-spacing cho readability tốt hơn
  - Thêm font-weight variations (không chỉ 400 và 900)

---

## Section 4: Missing Pages/Routes (404 Check)

| Issue ID | Page | Route | Priority |
|----------|------|-------|----------|
| **[MISS-001]** | Trang Liên hệ | `/contact` | High |
| **[MISS-002]** | Trang Giới thiệu | `/about` | Medium |
| **[MISS-003]** | Hướng dẫn mua hàng | `/guide` | Low |
| **[MISS-004]** | Chính sách đổi trả | `/return-policy` | High |
| **[MISS-005]** | Chính sách vận chuyển | `/shipping` | Medium |
| **[MISS-006]** | Tuyển dụng | `/careers` | Low |

---

## Section 5: Component Library & Visual Consistency

### **[CON-001]** Inconsistent border-radius trong UI components
- **Buttons**: `rounded-md` (4px) trong shadcn, nhưng project dùng các giá trị khác nhau
- **Cards**: Có nơi dùng `rounded-lg` (8px), có nơi không có border-radius
- **Inputs**: Đa số là square (0px radius)
- **What needs change**: Thống nhất design system - đề xuất 8px (rounded-lg) cho tất cả elements

### **[CON-002]** Inconsistent spacing scale
- **Location**: Toàn bộ project
- **Issue**: Có nơi dùng `space-y-4`, có nơi `gap-6`, `mb-8`, `py-12` - không có rhythm rõ ràng
- **What needs change**: Áp dụng 8px grid system consistently (4, 8, 16, 24, 32, 48, 64)

### **[CON-003]** Shadow usage inconsistent
- **Issue**: Có nơi dùng `shadow-xl`, có nơi `shadow-sm`, có nơi không có shadow
- **What needs change**: Định nghĩa 3 levels của shadow (subtle, default, elevated) và apply consistently

---

## Section 6: Responsive & Mobile Experience

### **[RES-001]** Filter sidebar chiếm full width trên mobile - Không user-friendly
- **Location**: `frontend/src/app/(shop)/products/page.tsx`
- **Current**: Sidebar nằm trên cùng, push content xuống rất xa
- **What needs change**: Filter nên là collapsible drawer hoặc slide-out panel trên mobile

### **[RES-002]** Product grid columns không optimized cho mobile
- **Location**: `frontend/src/app/(shop)/products/page.tsx`
- **Current**: `grid-cols-2` cho mobile có thể quá nhỏ với product cards
- **What needs change**: Consider single column hoặc cards nhỏ hơn trên mobile

### **[RES-003]** Header navigation không có mobile menu
- **Location**: `frontend/src/components/layout/Header.tsx`
- **Current**: Navigation ẩn hoàn toàn trên mobile (`hidden md:flex`)
- **What needs change**: Hamburger menu với slide-out navigation drawer

### **[RES-004]** Checkout form fields quá nhỏ trên mobile
- **Location**: `frontend/src/app/checkout/page.tsx`
- **Current**: Input height chỉ ~48px, khó touch
- **What needs change**: Minimum 56px touch targets cho mobile

---

## Section 7: Final Design Scorecard

| Yếu tố | Score | Ghi chú chi tiết |
|--------|-------|------------------|
| **Visual Appeal** | 5/10 | Color palette quá an toàn (monochrome), thiếu accent colors. Layout đơn giản nhưng không có "wow factor". Cần thêm gradients, better imagery, và micro-interactions. |
| **Layout & Spacing** | 6/10 | Nhìn chung balanced nhưng spacing inconsistent. White space có nhưng chưa được sử dụng hiệu quả để tạo hierarchy. Grid system cần chặt chẽ hơn. |
| **Color Palette** | 4/10 | Chủ yếu black/white/gray. Thiếu brand personality. Status colors (success, warning) chưa nổi bật. Cần thêm accent color cho fashion niche. |
| **Typography** | 5/10 | Font choice (Geist Sans) tốt nhưng usage chưa tối ưu. Tất cả headings đều uppercase làm mất readability. Line-height body text cần tăng. Hierarchy chưa rõ. |
| **Micro-interactions** | 4/10 | Có hover states cơ bản nhưng thiếu polish. No loading states đẹp, no success animations, transitions đơn giản. Cần thêm smooth easing functions. |
| **Responsive** | 5/10 | Layout responsive cơ bản nhưng mobile experience chưa tối ưu. Navigation missing trên mobile, touch targets quá nhỏ, filter UX kém trên mobile. |
| **Overall UX** | 6/10 | User flow logic tốt, đầy đủ chức năng. Nhưng có dead links, một số features disabled gây confuse. Consistency cần cải thiện. |

### **Tổng điểm trung bình: 5.0/10**

---

## Summary of Priority Actions

### Immediate (This Sprint):
1. Fix dead links trong Footer (UI-HIGH-002)
2. Ẩn hoặc hoàn thiện tab "Đổi mật khẩu" (UI-HIGH-001)
3. Thêm mobile navigation menu (UI-HIGH-004)

### Short-term (Next 2 Sprints):
4. Redesign buttons với better border-radius và sizes (UI-VIS-001)
5. Improve product card hover effects (UI-VIS-003)
6. Add shimmer loading states (UI-VIS-006)
7. Fix filter sidebar trên mobile (RES-001)

### Long-term ( polish phase):
8. Introduce accent color palette (UI-VIS-002)
9. Redesign hero banner với more impact (UI-VIS-008)
10. Standardize typography hierarchy (UI-VIS-012)
11. Add micro-interactions throughout (UI-VIS-005)

---

*Report generated for Fash.On E-commerce Platform*

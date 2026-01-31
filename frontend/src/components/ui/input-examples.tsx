/**
 * Input Component Examples & Usage Guide
 * 
 * This file demonstrates how to use the redesigned input components.
 * Copy patterns from here for Login, Register, Checkout, Dashboard forms.
 */

import { Input } from "./input"
import { FloatingInput } from "./floating-input"
import { Mail, Lock, User, Phone, MapPin, CreditCard, Search } from "lucide-react"

export function InputExamples() {
  return (
    <div className="space-y-12 p-8 max-w-2xl">
      
      {/* 1. Basic Input */}
      <section>
        <h2 className="text-lg font-bold mb-4">1. Basic Input</h2>
        <Input 
          placeholder="Nhập thông tin..."
        />
      </section>

      {/* 2. Floating Label Input - NO Icon */}
      <section>
        <h2 className="text-lg font-bold mb-4">2. Floating Label (No Icon)</h2>
        <div className="space-y-4">
          <FloatingInput
            label="Họ và tên"
            type="text"
          />
          <FloatingInput
            label="Email"
            type="email"
          />
        </div>
      </section>

      {/* 3. Floating Label + Icon (RECOMMENDED) */}
      <section>
        <h2 className="text-lg font-bold mb-4">3. Floating Label + Icon (RECOMMENDED)</h2>
        <div className="space-y-4">
          <FloatingInput
            label="Họ và tên"
            type="text"
            icon={User}
          />
          
          <FloatingInput
            label="Email"
            type="email"
            icon={Mail}
          />
          
          <FloatingInput
            label="Mật khẩu"
            type="password"
            icon={Lock}
          />
          
          <FloatingInput
            label="Số điện thoại"
            type="tel"
            icon={Phone}
          />
        </div>
      </section>

      {/* 4. Password with Show/Hide Toggle */}
      <section>
        <h2 className="text-lg font-bold mb-4">4. Password with Toggle</h2>
        <div className="relative">
          <FloatingInput
            label="Mật khẩu"
            type="password"
            icon={Lock}
            className="pr-12"
          />
          {/* Eye button positioned at right */}
          <button 
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-neutral-100 rounded-lg transition-colors z-10"
          >
            <span className="text-sm text-neutral-500">👁</span>
          </button>
        </div>
      </section>

      {/* 5. Input States */}
      <section>
        <h2 className="text-lg font-bold mb-4">5. Input States</h2>
        <div className="space-y-4">
          {/* Normal */}
          <FloatingInput
            label="Normal"
            type="text"
            icon={User}
            defaultValue="Giá trị bình thường"
          />
          
          {/* Disabled */}
          <FloatingInput
            label="Email (Disabled)"
            type="email"
            icon={Mail}
            defaultValue="user@example.com"
            disabled
          />
          
          {/* Error */}
          <FloatingInput
            label="Email"
            type="email"
            icon={Mail}
            error="Email không hợp lệ"
            defaultValue="invalid-email"
          />
        </div>
      </section>

      {/* 6. Checkout Form Example */}
      <section>
        <h2 className="text-lg font-bold mb-4">6. Checkout Form Pattern</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FloatingInput
              label="Họ"
              type="text"
              icon={User}
            />
            <FloatingInput
              label="Tên"
              type="text"
              icon={User}
            />
          </div>
          
          <FloatingInput
            label="Số điện thoại"
            type="tel"
            icon={Phone}
          />
          
          <FloatingInput
            label="Địa chỉ giao hàng"
            type="text"
            icon={MapPin}
          />
        </div>
      </section>

      {/* 7. Search Input */}
      <section>
        <h2 className="text-lg font-bold mb-4">7. Search Input</h2>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 pointer-events-none" />
          <Input
            className="pl-12 pr-4"
            placeholder="Tìm kiếm sản phẩm..."
            type="search"
          />
        </div>
      </section>

      {/* 8. Usage Summary */}
      <section>
        <h2 className="text-lg font-bold mb-4">8. Usage Summary</h2>
        <div className="bg-neutral-100 p-4 rounded-lg text-sm font-mono space-y-2">
          <p>{"// Basic input"}</p>
          <p>{"<Input placeholder=\"...\" />"}</p>
          <br/>
          <p>{"// Floating label"}</p>
          <p>{"<FloatingInput label=\"Họ tên\" />"}</p>
          <br/>
          <p>{"// With icon - RECOMMENDED"}</p>
          <p>{"<FloatingInput label=\"Email\" icon={Mail} />"}</p>
          <br/>
          <p>{"// With error"}</p>
          <p>{"<FloatingInput label=\"Email\" error=\"Invalid\" icon={Mail} />"}</p>
        </div>
      </section>

    </div>
  )
}

export default InputExamples

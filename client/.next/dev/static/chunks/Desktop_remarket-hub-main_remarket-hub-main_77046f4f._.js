(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/remarket-hub-main/remarket-hub-main/app/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/button.tsx",
        lineNumber: 42,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Input = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, type, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/input.tsx",
        lineNumber: 8,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Input;
Input.displayName = "Input";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Input$React.forwardRef");
__turbopack_context__.k.register(_c1, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/switch.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Switch",
    ()=>Switch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$switch$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/@radix-ui/react-switch/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const Switch = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$switch$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50", className),
        ...props,
        ref: ref,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$switch$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Thumb"], {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0")
        }, void 0, false, {
            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/switch.tsx",
            lineNumber: 18,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/switch.tsx",
        lineNumber: 10,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Switch;
Switch.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$switch$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Switch$React.forwardRef");
__turbopack_context__.k.register(_c1, "Switch");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/label.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/@radix-ui/react-label/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const labelVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
const Label = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(labelVariants(), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/label.tsx",
        lineNumber: 13,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Label;
Label.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Label$React.forwardRef");
__turbopack_context__.k.register(_c1, "Label");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/remarket-hub-main/remarket-hub-main/public/logo.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/logo.b86c7afb.png");}),
"[project]/Desktop/remarket-hub-main/remarket-hub-main/public/logo.png.mjs { IMAGE => \"[project]/Desktop/remarket-hub-main/remarket-hub-main/public/logo.png (static in ecmascript, tag client)\" } [app-client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$public$2f$logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/public/logo.png (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$public$2f$logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 561,
    height: 447,
    blurWidth: 8,
    blurHeight: 6,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAYAAAD+Bd/7AAAAiElEQVR42kVOSQ7CMAzs/z+COPAInoCEUMSuIKCHVmQhDW4cDU7V5TC2ZY9npmJmTIiCNxFCSvOuyjmjgHWD3bPBqrU4dBHTfiGcXrhstlg/atwjLYQkMk4kja5hzhqq/WAfIkyf8CsWJOUWOijrcXQeV/+V2UFJt/I4WHAJJeGY+hEyi0K5/QFSUrhzhrt6cgAAAABJRU5ErkJggg=="
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/switch.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$public$2f$logo$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$public$2f$logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/Desktop/remarket-hub-main/remarket-hub-main/public/logo.png.mjs { IMAGE => "[project]/Desktop/remarket-hub-main/remarket-hub-main/public/logo.png (static in ecmascript, tag client)" } [app-client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$context$2f$AuthContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/context/AuthContext.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
const Header = ({ isBuyerMode, onModeToggle })=>{
    _s();
    const { user, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$context$2f$AuthContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const handleLogout = async ()=>{
        await logout();
    };
    const handleModeChange = (checked)=>{
        // If trying to switch to Seller Mode (checked = true)
        if (checked && !user) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Login Required", {
                description: "You need to be logged in to access Seller Mode",
                action: {
                    label: "Login",
                    onClick: ()=>router.push('/login')
                }
            });
            return;
        }
        // Call the original toggle handler
        onModeToggle(!checked);
    };
    const userProfile = ()=>{
        router.push('/profile');
        console.log(user);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex h-16 items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "flex items-center gap-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$public$2f$logo$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$public$2f$logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                                alt: "Dosro Bazar",
                                width: 120,
                                height: 40,
                                className: "h-10 w-auto cursor-pointer"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                lineNumber: 57,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                            lineNumber: 56,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden flex-1 max-w-xl md:block",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                        lineNumber: 63,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                        type: "search",
                                        placeholder: "Search for products...",
                                        className: "pl-10 bg-muted/50"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                        lineNumber: 64,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                lineNumber: 62,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        !isBuyerMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            size: "sm",
                            className: "hidden md:flex gap-2 ml-auto",
                            asChild: true,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/upload",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                        lineNumber: 75,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Upload Item"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                        lineNumber: 76,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                lineNumber: 74,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                            lineNumber: 73,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `flex items-center gap-2 md:gap-4 ${isBuyerMode ? 'ml-auto' : ''}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "mode-toggle",
                                            className: "text-xs md:text-sm font-medium cursor-pointer",
                                            children: isBuyerMode ? "Buy" : "Sell"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                            lineNumber: 84,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Switch"], {
                                            id: "mode-toggle",
                                            checked: !isBuyerMode,
                                            onCheckedChange: handleModeChange
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                            lineNumber: 87,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                    lineNumber: 83,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "icon",
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                            className: "h-5 w-5"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                            lineNumber: 98,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute -top-1 -right-1 h-4 w-4 rounded-full bg-secondary text-[10px] font-bold text-white flex items-center justify-center",
                                            children: "3"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                            lineNumber: 99,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                    lineNumber: 97,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "icon",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                        className: "h-5 w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                        lineNumber: 105,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                    lineNumber: 104,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                user ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            onClick: ()=>userProfile(),
                                            variant: "ghost",
                                            size: "sm",
                                            className: "gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                    className: "h-5 w-5"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                                    lineNumber: 111,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "hidden md:inline",
                                                    children: user.username?.split(' ')[0] || 'Profile'
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                                    lineNumber: 112,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                            lineNumber: 110,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "outline",
                                            size: "sm",
                                            onClick: handleLogout,
                                            className: "gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                                    lineNumber: 115,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "hidden md:inline",
                                                    children: "Logout"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                                    lineNumber: 116,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                            lineNumber: 114,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "default",
                                    size: "sm",
                                    asChild: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/login",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Login"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                            lineNumber: 122,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                        lineNumber: 121,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                    lineNumber: 120,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "icon",
                                    className: "md:hidden",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                        className: "h-5 w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                        lineNumber: 128,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                    lineNumber: 127,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                            lineNumber: 81,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "pb-3 md:hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                lineNumber: 136,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                type: "search",
                                placeholder: "Search...",
                                className: "pl-10 bg-muted/50"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                                lineNumber: 137,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                        lineNumber: 135,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
                    lineNumber: 134,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
            lineNumber: 53,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Header, "mU4omnRdQA8PySeBpGE/lWg2WMg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$context$2f$AuthContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Header;
const __TURBOPACK__default__export__ = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/scroll-area.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScrollArea",
    ()=>ScrollArea,
    "ScrollBar",
    ()=>ScrollBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/@radix-ui/react-scroll-area/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const ScrollArea = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative overflow-hidden", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
                className: "h-full w-full rounded-[inherit]",
                children: children
            }, void 0, false, {
                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/scroll-area.tsx",
                lineNumber: 11,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScrollBar, {}, void 0, false, {
                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/scroll-area.tsx",
                lineNumber: 12,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Corner"], {}, void 0, false, {
                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/scroll-area.tsx",
                lineNumber: 13,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/scroll-area.tsx",
        lineNumber: 10,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = ScrollArea;
ScrollArea.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
const ScrollBar = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, orientation = "vertical", ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollAreaScrollbar"], {
        ref: ref,
        orientation: orientation,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollAreaThumb"], {
            className: "relative flex-1 rounded-full bg-border"
        }, void 0, false, {
            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/scroll-area.tsx",
            lineNumber: 33,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/scroll-area.tsx",
        lineNumber: 22,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c2 = ScrollBar;
ScrollBar.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollAreaScrollbar"].displayName;
;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ScrollArea$React.forwardRef");
__turbopack_context__.k.register(_c1, "ScrollArea");
__turbopack_context__.k.register(_c2, "ScrollBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/CategoryNav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/lucide-react/dist/esm/icons/smartphone.js [app-client] (ecmascript) <export default as Smartphone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$laptop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Laptop$3e$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/lucide-react/dist/esm/icons/laptop.js [app-client] (ecmascript) <export default as Laptop>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/lucide-react/dist/esm/icons/car.js [app-client] (ecmascript) <export default as Car>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shirt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shirt$3e$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/lucide-react/dist/esm/icons/shirt.js [app-client] (ecmascript) <export default as Shirt>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Book$3e$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/lucide-react/dist/esm/icons/book.js [app-client] (ecmascript) <export default as Book>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dumbbell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dumbbell$3e$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/lucide-react/dist/esm/icons/dumbbell.js [app-client] (ecmascript) <export default as Dumbbell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gamepad$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gamepad2$3e$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/lucide-react/dist/esm/icons/gamepad-2.js [app-client] (ecmascript) <export default as Gamepad2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/scroll-area.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
const categories = [
    {
        name: "Electronics",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"]
    },
    {
        name: "Computers",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$laptop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Laptop$3e$__["Laptop"]
    },
    {
        name: "Home & Garden",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"]
    },
    {
        name: "Vehicles",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__["Car"]
    },
    {
        name: "Fashion",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shirt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shirt$3e$__["Shirt"]
    },
    {
        name: "Books",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Book$3e$__["Book"]
    },
    {
        name: "Sports",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dumbbell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dumbbell$3e$__["Dumbbell"]
    },
    {
        name: "Gaming",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gamepad$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gamepad2$3e$__["Gamepad2"]
    }
];
const CategoryNav = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "border-b bg-card",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollArea"], {
                className: "w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 py-3",
                        children: categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                className: "flex items-center gap-2 whitespace-nowrap hover:bg-primary/10 hover:text-primary",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(category.icon, {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/CategoryNav.tsx",
                                        lineNumber: 30,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm",
                                        children: category.name
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/CategoryNav.tsx",
                                        lineNumber: 31,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, category.name, true, {
                                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/CategoryNav.tsx",
                                lineNumber: 25,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/CategoryNav.tsx",
                        lineNumber: 23,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollBar"], {
                        orientation: "horizontal"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/CategoryNav.tsx",
                        lineNumber: 35,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/CategoryNav.tsx",
                lineNumber: 22,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/CategoryNav.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/CategoryNav.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = CategoryNav;
const __TURBOPACK__default__export__ = CategoryNav;
var _c;
__turbopack_context__.k.register(_c, "CategoryNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/HeroBanner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/button.tsx [app-client] (ecmascript)");
"use client";
;
;
;
const HeroBanner = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-secondary rounded-2xl",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4 py-12 md:py-16",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-4xl md:text-5xl font-bold text-white mb-4",
                            children: "Buy, Sell, or Bid on Amazing Deals"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/HeroBanner.tsx",
                            lineNumber: 11,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-lg text-white/90 mb-6",
                            children: "Join thousands of happy buyers and sellers. Find great deals or sell your items quickly and easily."
                        }, void 0, false, {
                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/HeroBanner.tsx",
                            lineNumber: 14,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    size: "lg",
                                    variant: "secondary",
                                    className: "gap-2",
                                    children: [
                                        "Start Selling",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/HeroBanner.tsx",
                                            lineNumber: 20,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/HeroBanner.tsx",
                                    lineNumber: 18,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    size: "lg",
                                    variant: "outline",
                                    className: "bg-white hover:bg-white/90",
                                    children: "Browse Items"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/HeroBanner.tsx",
                                    lineNumber: 22,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/HeroBanner.tsx",
                            lineNumber: 17,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/HeroBanner.tsx",
                    lineNumber: 10,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                }, void 0, false, {
                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/HeroBanner.tsx",
                    lineNumber: 29,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute -right-10 -bottom-10 w-48 h-48 bg-secondary/20 rounded-full blur-2xl"
                }, void 0, false, {
                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/HeroBanner.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/HeroBanner.tsx",
            lineNumber: 9,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/HeroBanner.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = HeroBanner;
const __TURBOPACK__default__export__ = HeroBanner;
var _c;
__turbopack_context__.k.register(_c, "HeroBanner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-lg border bg-card text-card-foreground shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/card.tsx",
        lineNumber: 6,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Card;
Card.displayName = "Card";
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 p-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/card.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = CardHeader;
CardHeader.displayName = "CardHeader";
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-2xl font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/card.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = CardTitle;
CardTitle.displayName = "CardTitle";
const CardDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/card.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = CardDescription;
CardDescription.displayName = "CardDescription";
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/card.tsx",
        lineNumber: 32,
        columnNumber: 37
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = CardContent;
CardContent.displayName = "CardContent";
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/card.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = CardFooter;
CardFooter.displayName = "CardFooter";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "Card$React.forwardRef");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "CardHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "CardHeader");
__turbopack_context__.k.register(_c4, "CardTitle$React.forwardRef");
__turbopack_context__.k.register(_c5, "CardTitle");
__turbopack_context__.k.register(_c6, "CardDescription$React.forwardRef");
__turbopack_context__.k.register(_c7, "CardDescription");
__turbopack_context__.k.register(_c8, "CardContent$React.forwardRef");
__turbopack_context__.k.register(_c9, "CardContent");
__turbopack_context__.k.register(_c10, "CardFooter$React.forwardRef");
__turbopack_context__.k.register(_c11, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
            secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
            destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
            outline: "text-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge({ className, variant, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/badge.tsx",
        lineNumber: 26,
        columnNumber: 10
    }, this);
}
_c = Badge;
;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ProductCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/image.js [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
const ProductCard = ({ title, price, image, location, timePosted, isBiddable = false })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        className: "group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative aspect-square overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: image,
                        alt: title,
                        fill: true,
                        className: "object-cover group-hover:scale-110 transition-transform duration-300"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ProductCard.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        size: "icon",
                        variant: "ghost",
                        className: "absolute top-2 right-2 bg-white/90 hover:bg-white hover:text-secondary z-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ProductCard.tsx",
                            lineNumber: 33,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ProductCard.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    isBiddable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                        className: "absolute top-2 left-2 bg-secondary z-10",
                        children: "Open to Bids"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ProductCard.tsx",
                        lineNumber: 36,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ProductCard.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-semibold text-lg line-clamp-2 mb-2",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ProductCard.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-2xl font-bold text-primary",
                                children: [
                                    "$",
                                    price
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ProductCard.tsx",
                                lineNumber: 44,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            isBiddable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                size: "sm",
                                variant: "outline",
                                className: "text-xs",
                                children: "Place Bid"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ProductCard.tsx",
                                lineNumber: 46,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ProductCard.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 text-sm text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                className: "h-3 w-3"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ProductCard.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "truncate",
                                children: location
                            }, void 0, false, {
                                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ProductCard.tsx",
                                lineNumber: 53,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-auto text-xs",
                                children: timePosted
                            }, void 0, false, {
                                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ProductCard.tsx",
                                lineNumber: 54,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ProductCard.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ProductCard.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ProductCard.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = ProductCard;
const __TURBOPACK__default__export__ = ProductCard;
var _c;
__turbopack_context__.k.register(_c, "ProductCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$facebook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Facebook$3e$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/lucide-react/dist/esm/icons/facebook.js [app-client] (ecmascript) <export default as Facebook>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$twitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Twitter$3e$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/lucide-react/dist/esm/icons/twitter.js [app-client] (ecmascript) <export default as Twitter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$instagram$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Instagram$3e$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/lucide-react/dist/esm/icons/instagram.js [app-client] (ecmascript) <export default as Instagram>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$public$2f$logo$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$public$2f$logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/Desktop/remarket-hub-main/remarket-hub-main/public/logo.png.mjs { IMAGE => "[project]/Desktop/remarket-hub-main/remarket-hub-main/public/logo.png (static in ecmascript, tag client)" } [app-client] (structured image object with data url, ecmascript)');
"use client";
;
;
;
;
;
const Footer = ()=>{
    const footerLinks = {
        "About": [
            "About Us",
            "Careers",
            "Press",
            "Blog"
        ],
        "Support": [
            "Help Center",
            "Safety Tips",
            "Contact Us",
            "FAQs"
        ],
        "Legal": [
            "Terms of Service",
            "Privacy Policy",
            "Cookie Policy"
        ]
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "border-t bg-card mt-12",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4 py-12",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:col-span-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$public$2f$logo$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$public$2f$logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                                    alt: "Dosro Bazar",
                                    width: 144,
                                    height: 48,
                                    className: "h-12 mb-4"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx",
                                    lineNumber: 21,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-muted-foreground mb-4",
                                    children: "Your trusted marketplace for buying, selling, and bidding on quality items."
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx",
                                    lineNumber: 22,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            size: "icon",
                                            variant: "outline",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$facebook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Facebook$3e$__["Facebook"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx",
                                                lineNumber: 27,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx",
                                            lineNumber: 26,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            size: "icon",
                                            variant: "outline",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$twitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Twitter$3e$__["Twitter"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx",
                                                lineNumber: 30,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx",
                                            lineNumber: 29,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            size: "icon",
                                            variant: "outline",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$instagram$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Instagram$3e$__["Instagram"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx",
                                                lineNumber: 33,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx",
                                            lineNumber: 32,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            size: "icon",
                                            variant: "outline",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx",
                                                lineNumber: 36,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx",
                                            lineNumber: 35,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx",
                                    lineNumber: 25,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx",
                            lineNumber: 20,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        Object.entries(footerLinks).map(([title, links])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-semibold mb-4",
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx",
                                        lineNumber: 44,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "space-y-2",
                                        children: links.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "#",
                                                    className: "text-sm text-muted-foreground hover:text-primary transition-colors",
                                                    children: link
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx",
                                                    lineNumber: 48,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, link, false, {
                                                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx",
                                                lineNumber: 47,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx",
                                        lineNumber: 45,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, title, true, {
                                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx",
                                lineNumber: 43,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx",
                    lineNumber: 18,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-t mt-8 pt-8 text-center text-sm text-muted-foreground",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "© ",
                            new Date().getFullYear(),
                            " Dosro Bazar. All rights reserved."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx",
                        lineNumber: 62,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx",
                    lineNumber: 61,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx",
            lineNumber: 17,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Footer;
const __TURBOPACK__default__export__ = Footer;
var _c;
__turbopack_context__.k.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$CategoryNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/CategoryNav.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$HeroBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/HeroBanner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ProductCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$Footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/Footer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/ui/button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function Home() {
    _s();
    const [isBuyerMode, setIsBuyerMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Mock data for products
    const recentListings = [
        {
            id: 1,
            title: "iPhone 14 Pro - Excellent Condition",
            price: 899,
            image: "data:image/webp;base64,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",
            location: "San Francisco, CA",
            timePosted: "2h ago",
            isBiddable: true
        },
        {
            id: 2,
            title: "Vintage Leather Jacket",
            price: 150,
            image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
            location: "Los Angeles, CA",
            timePosted: "5h ago",
            isBiddable: true
        },
        {
            id: 3,
            title: "MacBook Pro 16\" 2023",
            price: 2199,
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
            location: "Seattle, WA",
            timePosted: "1d ago",
            isBiddable: false
        },
        {
            id: 4,
            title: "Gaming Chair - Like New",
            price: 299,
            image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400",
            location: "Austin, TX",
            timePosted: "3h ago",
            isBiddable: true
        },
        {
            id: 5,
            title: "Canon EOS R5 Camera",
            price: 3299,
            image: "https://images.unsplash.com/photo-1606980702954-f34cb5446478?w=400",
            location: "New York, NY",
            timePosted: "6h ago",
            isBiddable: false
        },
        {
            id: 6,
            title: "Designer Sneakers Collection",
            price: 450,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
            location: "Miami, FL",
            timePosted: "12h ago",
            isBiddable: true
        }
    ];
    const recommendedItems = [
        {
            id: 7,
            title: "Smart Watch Series 8",
            price: 399,
            image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400",
            location: "Boston, MA",
            timePosted: "4h ago",
            isBiddable: false
        },
        {
            id: 8,
            title: "Mountain Bike - Carbon Frame",
            price: 1200,
            image: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400",
            location: "Denver, CO",
            timePosted: "8h ago",
            isBiddable: true
        },
        {
            id: 9,
            title: "Acoustic Guitar - Professional",
            price: 650,
            image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400",
            location: "Nashville, TN",
            timePosted: "1d ago",
            isBiddable: false
        },
        {
            id: 10,
            title: "Designer Handbag",
            price: 850,
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
            location: "Chicago, IL",
            timePosted: "10h ago",
            isBiddable: true
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isBuyerMode: isBuyerMode,
                onModeToggle: setIsBuyerMode
            }, void 0, false, {
                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                lineNumber: 113,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$CategoryNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                lineNumber: 114,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4 py-6 space-y-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$HeroBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                            lineNumber: 119,
                            columnNumber: 11
                        }, this),
                        isBuyerMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            className: "text-3xl font-bold mb-2",
                                                            children: "Recently Listed"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                                            lineNumber: 127,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-muted-foreground",
                                                            children: "Fresh items just added to the marketplace"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                                            lineNumber: 128,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                                    lineNumber: 126,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "outline",
                                                    children: "View All"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                                    lineNumber: 130,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                            lineNumber: 125,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
                                            children: recentListings.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    ...product
                                                }, product.id, false, {
                                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                                    lineNumber: 134,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                            lineNumber: 132,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                    lineNumber: 124,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            className: "text-3xl font-bold mb-2",
                                                            children: "Recommended for You"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                                            lineNumber: 143,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-muted-foreground",
                                                            children: "Handpicked based on your interests"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                                            lineNumber: 144,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                                    lineNumber: 142,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "outline",
                                                    children: "View All"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                                    lineNumber: 146,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                            lineNumber: 141,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
                                            children: recommendedItems.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    ...product
                                                }, product.id, false, {
                                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                                    lineNumber: 150,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                            lineNumber: 148,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                    lineNumber: 140,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            className: "text-3xl font-bold mb-2",
                                                            children: "Your Listings"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                                            lineNumber: 161,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-muted-foreground",
                                                            children: "Manage your items and track performance"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                                            lineNumber: 162,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                                    lineNumber: 160,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    className: "gap-2",
                                                    children: "Upload New Item"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                                    lineNumber: 164,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                            lineNumber: 159,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
                                            children: recentListings.slice(0, 3).map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    ...product
                                                }, product.id, false, {
                                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                                    lineNumber: 170,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                            lineNumber: 168,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                    lineNumber: 158,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    className: "grid grid-cols-1 md:grid-cols-3 gap-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 text-white",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-semibold mb-2",
                                                    children: "Active Listings"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                                    lineNumber: 178,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-4xl font-bold",
                                                    children: "12"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                                    lineNumber: 179,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                            lineNumber: 177,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-gradient-to-br from-secondary to-secondary/80 rounded-xl p-6 text-white",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-semibold mb-2",
                                                    children: "Total Sales"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                                    lineNumber: 182,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-4xl font-bold",
                                                    children: "$4,250"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                                    lineNumber: 183,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                            lineNumber: 181,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-gradient-to-br from-primary/80 to-secondary/80 rounded-xl p-6 text-white",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-semibold mb-2",
                                                    children: "Pending Bids"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                                    lineNumber: 186,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-4xl font-bold",
                                                    children: "8"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                                    lineNumber: 187,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                            lineNumber: 185,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                                    lineNumber: 176,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                    lineNumber: 117,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$components$2f$Footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
                lineNumber: 195,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/page.tsx",
        lineNumber: 112,
        columnNumber: 5
    }, this);
}
_s(Home, "1FHQx+oEca/HkLqRU8aVml4y8ds=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_remarket-hub-main_remarket-hub-main_77046f4f._.js.map
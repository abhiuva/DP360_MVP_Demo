import { IconBrandPaypal, IconBrandStripe, IconBuildingBank, IconCash, IconCreditCard, IconDeviceIpad, IconDiscount, IconQrcode, IconPrinter, IconWallet } from "@tabler/icons-react";
import { iconStroke } from "./config";

export const PAYMENT_ICONS = {
    'cash': <IconCash stroke={iconStroke} />,
    'card': <IconCreditCard stroke={iconStroke} />,
    'wallet': <IconWallet stroke={iconStroke} />,
    'paypal': <IconBrandPaypal stroke={iconStroke} />,
    'stripe': <IconBrandStripe stroke={iconStroke} />,
    'qrcode': <IconQrcode stroke={iconStroke} />,
    'reader': <IconDeviceIpad stroke={iconStroke} />,
    'bank': <IconBuildingBank stroke={iconStroke} />,
    'discount': <IconDiscount stroke={iconStroke} />,
    'terminal': <IconPrinter size={24} />,
}
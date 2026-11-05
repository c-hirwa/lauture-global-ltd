// Single source of truth for how people reach Lauture Global.
export const CONTACT = {
  email: "info@lautureglobal.com",
  phoneDisplay: "+250 792 866 210",
  phoneHref: "tel:+250792866210",
  whatsappHref: "https://wa.me/250792866210?text=" + encodeURIComponent("Hello Lauture Global, I'd like to know more about your services."),
  address: ["KG 17 Avenue Remera Corner Building Suite 201,", "Remera, Kigali, RWANDA"],
} as const;

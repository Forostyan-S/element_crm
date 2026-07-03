export const zIndex = {
  content: 0,
  header: 10,
  bottomNav: 20,
  fab: 30,
  fabBackdrop: 40,
  fabSheet: 50,
  backdrop: 100,
  bottomSheet: 110,
  modal: 120,
  modalPanel: 130,
  dialog: 150,
  toast: 200,
  splash: 9999,
} as const;

export type ZLayer = keyof typeof zIndex;

import { MenuItem } from "../types/menu";

export enum Menu {
  Today = 'today',
  Last7Days = 'last-7-days',
  Done = 'done',
  Abandon = 'abandon',
  Trash = 'trash',
  Overview = 'overview'
}

const MenuTitleMap = new Map([
  [Menu.Today, '今天'],
  [Menu.Last7Days, '近 7 天'],
  [Menu.Done, '已完成'],
  [Menu.Abandon, '已放弃'],
  [Menu.Trash, '回收站'],
  [Menu.Overview, '摘要'],
]);

const MenuIconMap = new Map([
  [Menu.Today, 'icon-schedule'],
  [Menu.Last7Days, 'icon-calendar'],
  [Menu.Done, 'icon-check'],
  [Menu.Abandon, 'icon-close'],
  [Menu.Trash, 'icon-delete'],
  [Menu.Overview, 'icon-mind-mapping'],
]);

const menus: MenuItem[] = [
  Menu.Today,
  Menu.Last7Days,
  Menu.Done,
  Menu.Abandon,
  Menu.Trash,
  Menu.Overview,
].map(menu => {
  return {
    key: menu,
    icon: MenuIconMap.get(menu) || '',
    title: MenuTitleMap.get(menu) || '',
  }
})

export default menus;
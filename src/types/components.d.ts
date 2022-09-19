import CpNavBar from '@/components/cp-nav-bar.vue'
// export default NavBar;
// export type { NavBarProps } from './NavBar';
// declare module 'vue' {
//     interface GlobalComponents {
//         VanNavBar: typeof NavBar;
//     }
// }
declare module 'vue' {
  interface GlobalComponents {
    CpNavBar: typeof CpNavBar
  }
}

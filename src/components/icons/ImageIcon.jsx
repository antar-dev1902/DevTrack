// Icons are real standalone SVG image files under src/assets/icons/ (open
// any of them directly — they're valid, viewable images on their own), not
// hand-authored path data living inside a JSX component.
//
// They're applied as a CSS mask (background-color: currentColor, masked by
// the image's shape) rather than as a plain <img>, so a single set of icon
// image files can still show up orange in an accent badge, red on a delete
// button, white on the dark navbar, green on a completed state, etc. — the
// same theming every button/badge/status color in this app already relies
// on. A flat <img> would bake in one fixed color and break all of that.
import check from '../../assets/icons/check.svg';
import arrowRight from '../../assets/icons/arrow-right.svg';
import code from '../../assets/icons/code.svg';
import rocket from '../../assets/icons/rocket.svg';
import trophy from '../../assets/icons/trophy.svg';
import users from '../../assets/icons/users.svg';
import github from '../../assets/icons/github.svg';
import linkedin from '../../assets/icons/linkedin.svg';
import search from '../../assets/icons/search.svg';
import filter from '../../assets/icons/filter.svg';
import plus from '../../assets/icons/plus.svg';
import x from '../../assets/icons/x.svg';
import lock from '../../assets/icons/lock.svg';
import target from '../../assets/icons/target.svg';
import calendar from '../../assets/icons/calendar.svg';
import clock from '../../assets/icons/clock.svg';
import layers from '../../assets/icons/layers.svg';
import edit from '../../assets/icons/edit.svg';
import trash from '../../assets/icons/trash.svg';
import external from '../../assets/icons/external.svg';
import compass from '../../assets/icons/compass.svg';
import zap from '../../assets/icons/zap.svg';
import layout from '../../assets/icons/layout.svg';
import book from '../../assets/icons/book.svg';
import menu from '../../assets/icons/menu.svg';

const images = {
  check, arrowRight, code, rocket, trophy, users, github, linkedin, search,
  filter, plus, x, lock, target, calendar, clock, layers, edit, trash,
  external, compass, zap, layout, book, menu,
};

export default function Icon({ name, size = 20, className = '' }) {
  const src = images[name];
  if (!src) return null;
  return (
    <span
      role="img"
      aria-hidden="true"
      className={`icon ${className}`}
      style={{
        display: 'inline-block',
        flexShrink: 0,
        width: size,
        height: size,
        backgroundColor: 'currentColor',
        // Quoted: the data URI Vite generates for these SVGs uses unescaped
        // single quotes internally (xmlns='...', stroke='#000'), which an
        // UNquoted CSS url() token can't legally contain — the browser
        // silently drops the whole mask-image declaration otherwise.
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  );
}

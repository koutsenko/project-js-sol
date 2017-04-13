import { highlights } from '../../../constants/app';

export default function getFxHighlight(highlight) {
  return {
    [ highlights.ACCEPT ] : 'fx_lime',
    [ highlights.DENY   ] : 'fx_red'
  }[highlight] || '';
}
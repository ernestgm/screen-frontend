import {filter} from "lodash";

// a, b, orderBy
function descendingComparator(_a, _b, _orderBy) {
    if (_b[_orderBy] < _a[_orderBy]) {
        return -1;
    }
    if (_b[_orderBy] > _a[_orderBy]) {
        return 1;
    }
    return 0;
}

// order, orderBy
export function getComparator(props) {
    const {_order, _orderBy} = props
    return _order === 'desc'
        ? (a, b) => descendingComparator(a, b, _orderBy)
        : (a, b) => -descendingComparator(a, b, _orderBy);
}

export function applySortFilter(props) {
    const {array, comparator, query} = props;
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}
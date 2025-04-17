export default class FilterManager {
    constructor(store, vm) {
        this.store = store;
        this.vm = vm;
    }

    addFilter(filterName, value) {
        if (!value) return;

        this.vm.filterSelectedValues[filterName] = value;
        const minMaxValue = this.extractMinMax(value);
        if (!minMaxValue) return;

        this.store.dispatch('map/updateFilter', {
            name: filterName,
            value: minMaxValue,
        });

        this.updateQueryParams(filterName, value);
        this.store.dispatch('map/applyFilters');
    }

    handleStatusFilter(filterName, value) {
        if (!value) return;

        this.vm.filterSelectedValues[filterName] = value;
        const valueObj = {
            min: value === 'Available' ? 1 : 0,
            max: value === 'Available' ? 1 : 0,
        };

        this.store.dispatch('map/updateFilter', {
            name: filterName,
            value: valueObj,
        });

        this.updateQueryParams(filterName, value);
        this.store.dispatch('map/applyFilters');
    }

    removeFilter(filterName) {
        this.vm.filterSelectedValues[filterName] = '';
        this.store.dispatch('map/removeFilterByName', filterName);
        this.removeQueryParams(filterName);
        this.store.dispatch('map/applyFilters');
    }

    applyFilterFromQuery(filterName, transform = this.extractMinMax) {
        const value = this.vm.$route.query[filterName];
        if (value) {
            this.vm.filterSelectedValues[filterName] = value;
            const formattedValue = transform.call(this, value);
            this.store.dispatch('map/updateFilter', {
                name: filterName,
                value: formattedValue,
            });
        }
    }

    loadFiltersFromQuery() {
        this.applyFilterFromQuery('distance');
        this.applyFilterFromQuery('rent');
        this.applyFilterFromQuery('status', (val) => ({
            min: val === 'Available' ? 1 : 0,
            max: val === 'Available' ? 1 : 0,
        }));
        this.store.dispatch('map/applyFilters');
    }

    extractMinMax(filter) {
        const numbers = filter.match(/\d+/g)?.map(Number) || [];
        if (numbers.length === 1) {
            return filter.includes('Less')
                ? { min: 0, max: numbers[0] }
                : { min: numbers[0], max: Infinity };
        } else if (numbers.length === 2) {
            return { min: numbers[0], max: numbers[1] };
        }
        return null;
    }

    updateQueryParams(filterName, value) {
        const url = new URL(window.location.href);
        url.searchParams.set(filterName, value);
        window.history.pushState({}, '', url.toString());
    }

    removeQueryParams(filterName) {
        const url = new URL(window.location.href);
        url.searchParams.delete(filterName);
        window.history.pushState({}, '', url.toString());
    }
}

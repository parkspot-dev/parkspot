export default class FilterManager {
    constructor(store, viewModel) {
        this.store = store;
        this.viewModel = viewModel;
    }

    addFilter(filterName, value) {
        if (!value) return;

        this.viewModel.filterSelectedValues[filterName] = value;
        const minMaxValue = this.extractMinMax(value);
        if (!minMaxValue) return;

        this.store.dispatch('map/updateFilter', {
            name: filterName,
            value: minMaxValue,
        });

        this.updateQueryParams(filterName, value);
        this.applyFilters();
    }

    handleStatusFilter(filterName, value) {
        if (!value) return;

        this.viewModel.filterSelectedValues[filterName] = value;
        const valueObj = {
            min: value === 'Available' ? 1 : 0,
            max: value === 'Available' ? 1 : 0,
        };

        this.store.dispatch('map/updateFilter', {
            name: filterName,
            value: valueObj,
        });

        this.updateQueryParams(filterName, value);
        this.applyFilters();
    }

    removeFilter(filterName) {
        this.viewModel.filterSelectedValues[filterName] = '';
        this.store.dispatch('map/removeFilterByName', filterName);
        this.removeQueryParams(filterName);
        this.applyFilters();
    }

    applyFilterFromQuery(filterName, transform = this.extractMinMax) {
        const value = this.viewModel.$route.query[filterName];
        if (value) {
            this.viewModel.filterSelectedValues[filterName] = value;
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

        // check for sort
        if(this.viewModel.$route.query['sort']) {
            this.store.dispatch('map/updateSort', {
                name: this.viewModel.$route.query['sort'],
            });
        }

        this.applyFilters();
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

    applyFilters() {
        let filteredSpots = [...this.store.state.map.srpResults];

        for (let filter of this.store.state.map.filters) {
            if (filter.name === 'distance') {
                filteredSpots = filteredSpots.filter(
                    (srpResult) =>
                        srpResult.Distance >= filter.minValue &&
                        srpResult.Distance <= filter.maxValue,
                );
            } else if (filter.name === 'rent') {
                filteredSpots = filteredSpots.filter(
                    (srpResult) =>
                        srpResult.Rate >= filter.minValue &&
                        srpResult.Rate <= filter.maxValue,
                );
            } else if (filter.name === 'status') {
                if (filter.minValue > 0) {
                    filteredSpots = filteredSpots.filter(
                        (srpResult) => srpResult.SlotsAvailable > 0,
                    );
                } else {
                    filteredSpots = filteredSpots.filter(
                        (srpResult) => srpResult.SlotsAvailable === 0,
                    );
                }
            }
        }

        this.store.commit('map/update-filtered-srp-results', filteredSpots);
        if (this.viewModel.selectedSort && this.viewModel.selectedSort.name !== 'Recommended') {
            this.sortFilteredResults(
                this.viewModel.selectedSort.name,
                this.viewModel.selectedSort.order,
            );
        }
    }

    sortFilteredResults(field, order = 'asc') {
        if (!field) return;

        this.store.dispatch('map/updateSort', {
            name: field,
            order,
        });

        const sortedResults = [...this.viewModel.filteredSpots];

        if(field !== 'Recommended') {
            sortedResults.sort((a, b) => {
                let valueA = field === 'Rent' ? a.Rate : a.Distance;
                let valueB = field === 'Rent' ? b.Rate : b.Distance;
                return order === 'asc' ? valueA - valueB : valueB - valueA;
            });
        }

        this.updateQueryParams('sort', field);

        if(field === 'Recommended') {
            this.applyFilters();
        } else {
            this.store.commit('map/update-filtered-srp-results', sortedResults);
        }
    }
}

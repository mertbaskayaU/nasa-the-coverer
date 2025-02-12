import NEOCard from "./NEOCard";
import {render, screen} from "@testing-library/react";

describe('NEOCard Component', () => {
    it('renders NEOCard', () => {
        const neo = {
            absolute_magnitude_h: 0,
            id: "1",
            name: "name1",
            isFavorite: false,
            estimated_diameter: {kilometers: {estimated_diameter_min: 1, estimated_diameter_max: 2}},
            nasa_jpl_url: "url",
            neo_reference_id: "ref",
            close_approach_data: [],
            is_potentially_hazardous_asteroid: false
        };
        const onToggleFavorite = jest.fn();
        render(<NEOCard neo={neo} onToggleFavorite={onToggleFavorite} />);
        expect(screen.getByText(neo.name)).toBeInTheDocument();
    });

    it('calls onToggleFavorite on button click', () => {
        const neo = {
            absolute_magnitude_h: 0,
            id: "1",
            name: "name1",
            isFavorite: false,
            estimated_diameter: {kilometers: {estimated_diameter_min: 1, estimated_diameter_max: 2}},
            nasa_jpl_url: "url",
            neo_reference_id: "ref",
            close_approach_data: [],
            is_potentially_hazardous_asteroid: false
        };
        const onToggleFavorite = jest.fn();
        render(<NEOCard neo={neo} onToggleFavorite={onToggleFavorite} />);
        const button = screen.getByRole('button');
        button.click();
        expect(onToggleFavorite).toHaveBeenCalledTimes(1);
    });

    it('renders hazardous NEO', () => {
        const neo = {
            absolute_magnitude_h: 0,
            id: "1",
            name: "name1",
            isFavorite: false,
            estimated_diameter: {kilometers: {estimated_diameter_min: 1, estimated_diameter_max: 2}},
            nasa_jpl_url: "url",
            neo_reference_id: "ref",
            close_approach_data: [],
            is_potentially_hazardous_asteroid: true
        };
        const onToggleFavorite = jest.fn();
        render(<NEOCard neo={neo} onToggleFavorite={onToggleFavorite} />);
        expect(screen.getByText('Hazardous: Yes')).toBeInTheDocument();
    });

    it('renders non-hazardous NEO', () => {
        const neo = {
            absolute_magnitude_h: 0,
            id: "1",
            name: "name1",
            isFavorite: false,
            estimated_diameter: {kilometers: {estimated_diameter_min: 1, estimated_diameter_max: 2}},
            nasa_jpl_url: "url",
            neo_reference_id: "ref",
            close_approach_data: [],
            is_potentially_hazardous_asteroid: false
        };
        const onToggleFavorite = jest.fn();
        render(<NEOCard neo={neo} onToggleFavorite={onToggleFavorite} />);
        expect(screen.getByText('Hazardous: No')).toBeInTheDocument();
    });

    it('renders favorite NEO', () => {
        const neo = {
            absolute_magnitude_h: 0,
            id: "1",
            name: "name1",
            isFavorite: true,
            estimated_diameter: {kilometers: {estimated_diameter_min: 1, estimated_diameter_max: 2}},
            nasa_jpl_url: "url",
            neo_reference_id: "ref",
            close_approach_data: [],
            is_potentially_hazardous_asteroid: false
        };
        const onToggleFavorite = jest.fn();
        render(<NEOCard neo={neo} onToggleFavorite={onToggleFavorite} />);
        expect(screen.getByRole('button')).toHaveClass('favorite-active');
    });
});

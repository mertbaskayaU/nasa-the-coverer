import '@testing-library/jest-dom';
import {act, render, screen} from "@testing-library/react";
import App from "./App";
import {nasaStore} from "./stores/NasaStore";
import {runInAction} from "mobx";
import {APOD, NearEarthObject} from "./types/nasa";

describe('App Component', () => {
  beforeEach(() => {
    // Reset all mocks and set initial state
    jest.clearAllMocks();
    nasaStore.loading = true;
    nasaStore.error = null;
    nasaStore.apod = null;
    nasaStore.neoList = [];
  });

    it('renders the app with loading', () => {
      render(<App />);
      expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    it('fetches APOD and NEO data on mount', () => {
        const fetchAPODSpy = jest.spyOn(nasaStore, 'fetchAPOD');
        const fetchNEOSpy = jest.spyOn(nasaStore, 'fetchNEO');

        render(<App />);

        expect(fetchAPODSpy).toHaveBeenCalledTimes(1);
        expect(fetchNEOSpy).toHaveBeenCalledTimes(1);
    });

    it('renders error message when error', async () => {
        render(<App />);

        runInAction(() => {
            nasaStore.loading = false;
            nasaStore.error = "Error";
        });


        await act(() => {
            jest.runOnlyPendingTimers();
        })

        expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });

    it('renders APOD and NEO data', async () => {
        jest.spyOn(nasaStore, 'fetchAPOD').mockResolvedValue( new Promise(() => {}));
        jest.spyOn(nasaStore, 'fetchNEO').mockResolvedValue(new Promise(() => {}));

        const neo1: NearEarthObject = {
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

        const neo2: NearEarthObject = {
            absolute_magnitude_h: 0,
            id: "2",
            name: "name2",
            isFavorite: false,
            estimated_diameter: {kilometers: {estimated_diameter_min: 1, estimated_diameter_max: 2}},
            nasa_jpl_url: "url",
            neo_reference_id: "ref",
            close_approach_data: [],
            is_potentially_hazardous_asteroid: false
        }

        const apod: APOD = {
            title: "title",
            url: "url",
            explanation: "explanation",
            copyright: "", date: "", hdurl: "", media_type: "video", service_version: ""
        };

        render(<App />);

        runInAction(() => {
            nasaStore.loading = false;
            nasaStore.apod = apod;
            nasaStore.neoList = [neo1, neo2];
        });

        await act(() => {
            jest.runOnlyPendingTimers();
        })

        expect(nasaStore.apod).not.toBeNull();
        expect(nasaStore.neoList).toHaveLength(2);
        expect(screen.getByText(/title/i)).toBeInTheDocument();
        expect(screen.getByText(/name1/i)).toBeInTheDocument();
        expect(screen.getByText(/name2/i)).toBeInTheDocument();
    });


});

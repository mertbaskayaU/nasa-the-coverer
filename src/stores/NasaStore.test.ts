import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {nasaStore} from "./NasaStore";
import {NearEarthObject} from "../types/nasa";

const mock = new MockAdapter(axios);


describe("NasaStore", () => {
    beforeEach(() => {
        mock.reset();
        nasaStore.apod = null;
        nasaStore.neoList = [];
        nasaStore.loading = false;
        nasaStore.error = null;
    });

    it("should have initial values", () => {
        expect(nasaStore.apod).toBeNull();
        expect(nasaStore.neoList).toEqual([]);
        expect(nasaStore.loading).toBeFalsy();
        expect(nasaStore.error).toBeNull();
    });

    it("should fetch APOD", async () => {
        mock.onGet("https://api.nasa.gov/planetary/apod?api_key=dyriqiXka3OQwyFWl9Tf5KAONRskVMEaCtjFhSKl").reply(200, {
            title: "title",
            url: "url",
            explanation: "explanation"
        });
        await nasaStore.fetchAPOD();
        expect(nasaStore.apod?.title).toBe("title");
        expect(nasaStore.apod?.url).toBe("url");
        expect(nasaStore.apod?.explanation).toBe("explanation");
    });

    it("should fetch NEO", async () => {
        mock.onGet("https://api.nasa.gov/neo/rest/v1/feed?start_date=2022-01-01&end_date=2022-01-02&api_key=dyriqiXka3OQwyFWl9Tf5KAONRskVMEaCtjFhSKl").reply(200, {
            near_earth_objects: {
                "2022-01-01": [
                    {id: "1", name: "name1"},
                    {id: "2", name: "name2"}
                ],
                "2022-01-02": [
                    {id: "3", name: "name3"},
                    {id: "4", name: "name4"}
                ]
            }
        });
        await nasaStore.fetchNEO("2022-01-01", "2022-01-02");
        expect(nasaStore.neoList).toEqual([
            {id: "1", name: "name1"},
            {id: "2", name: "name2"},
            {id: "3", name: "name3"},
            {id: "4", name: "name4"}
        ]);
    });

    it("should toggle favorite", () => {
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

        nasaStore.neoList = [neo1, neo2];

        nasaStore.toggleFavorite("1");
        expect(nasaStore.neoList[0].isFavorite).toBeTruthy();
        expect(nasaStore.neoList[1].isFavorite).toBeFalsy();
    });

    it("should handle APOD loading state", async () => {
        mock.onGet("https://api.nasa.gov/planetary/apod?api_key=dyriqiXka3OQwyFWl9Tf5KAONRskVMEaCtjFhSKl").reply(200, {
            title: "title",
            url: "url",
            explanation: "explanation"
        });
        const promise = nasaStore.fetchAPOD();
        expect(nasaStore.loading).toBeTruthy();
        await promise;
        expect(nasaStore.loading).toBeFalsy();
    });

    it("should handle APOD error state", async () => {
        mock.onGet("https://api.nasa.gov/planetary/apod?api_key=dyriqiXka3OQwyFWl9Tf5KAONRskVMEaCtjFhSKl").reply(500);
        await nasaStore.fetchAPOD();
        expect(nasaStore.error).toBe("Failed to fetch APOD");
    });


    it("should handle NEO loading state", async () => {
        mock.onGet("https://api.nasa.gov/neo/rest/v1/feed?start_date=2022-01-01&end_date=2022-01-02&api_key=dyriqiXka3OQwyFWl9Tf5KAONRskVMEaCtjFhSKl").reply(200, {
            near_earth_objects: {
                "2022-01-01": [
                    {id: "1", name: "name1"},
                    {id: "2", name: "name2"}
                ],
                "2022-01-02": [
                    {id: "3", name: "name3"},
                    {id: "4", name: "name4"}
                ]
            }
        });
        const promise = nasaStore.fetchNEO("2022-01-01", "2022-01-02");
        expect(nasaStore.loading).toBeTruthy();
        await promise;
        expect(nasaStore.loading).toBeFalsy();
    });

    it("should handle NEO error state", async () => {
        mock.onGet("https://api.nasa.gov/neo/rest/v1/feed?start_date=2022-01-01&end_date=2022-01-02&api_key=dyriqiXka3OQwyFWl9Tf5KAONRskVMEaCtjFhSKl").reply(500);
        await nasaStore.fetchNEO("2022-01-01", "2022-01-02");
        expect(nasaStore.error).toBe("Failed to fetch NEO data");
    });

});

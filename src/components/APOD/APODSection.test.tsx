import {render, screen} from "@testing-library/react";
import APODSection from "./APODSection";
import {APOD} from "../../types/nasa";

describe('APODSection Component', () => {
    it('renders APODSection', () => {
        const apod: APOD = {
            title: "title",
            url: "url",
            explanation: "explanation",
            copyright: "", date: "", hdurl: "", media_type: "video", service_version: ""
        };

        render(<APODSection apod={apod} />);
        expect(screen.getByText(apod.title)).toBeInTheDocument();
    });

    it('does not render APODSection', () => {
        render(<APODSection apod={null} />);
        expect(screen.queryByText('title')).toBeNull();
    });
});

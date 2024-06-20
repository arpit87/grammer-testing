import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
	const [text, setText] = useState("");
	const [results2, setResults2] = useState([]);
	const [results3, setResults3] = useState([]);

	// ======= trinka API ======= //
	// const apiUrl =
	// 	"https://api-platform.trinka.ai/api/v2/plugin/check/paragraph";

	// const data = {
	// 	paragraph: "Wood a anatural material used of indoor environment.",
	// 	language: "US",
	// 	style_guide: "",
	// 	is_sensitive_data: false,
	// };

	// const headers = {
	// 	"x-api-key": "pHrj80LSWG6F2K6m8niBH3YH1Eax2URI3OHbvdBH",
	// 	"Content-Type": "application/json",
	// };
	// ======= //

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(text);
		try {
			// ======== Textgears API ======== //
			const res2 = await axios.post(
				`https://api.textgears.com/grammar?key=${
					import.meta.env.VITE_TEXTGEARS_API_KEY
				}&text=${text}`
			);
			setResults2(res2.data);

			// ======= languagetool API ======= //\
			const res3 = await axios.post(
				`https://api.languagetool.org/v2/check?text=${text}&language=en-US`
			);
			setResults3(res3.data);

			// ======= Trinka API ======= //
			// const res = await axios.post(apiUrl, data, {
			// 	headers: headers,
			// });
			console.log(res3.data);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<form className="form" onSubmit={handleSubmit}>
				<div className="input-area">
					<textarea
						id="text"
						name="text"
						value={text}
						placeholder="Enter your text here..."
						onChange={(e) => setText(e.target.value)}
						required
					/>
				</div>
				<div>
					<button className="btn">Submit</button>
				</div>
			</form>
			<br />
			<div className="results">
				{results2?.status && (
					<div>
						<h2>Results (TextGears API)</h2>
						<div className="errors">
							{results2.response.errors.length === 0 && (
								<p>No errors found!</p>
							)}
							{results2.response.errors.map((error, index) => (
								<div
									key={error.id}
									className={index % 2 === 0 ? "even" : "odd"}
								>
									<p>
										<strong>Error {index + 1}: </strong>
										{error.bad}
									</p>
									<div>
										<p>
											<strong>
												Suggested Corrections:{" "}
											</strong>
										</p>
										<ol>
											{error.better.map(
												(correction, idx) => (
													<li key={idx}>
														{correction}
													</li>
												)
											)}
										</ol>
									</div>
									<p>
										<strong>Explanation: </strong>
										{error.description.en}
									</p>
								</div>
							))}
						</div>
					</div>
				)}
				{results3?.matches.length != 0 && (
					<div>
						<h2>Results (LanguageTool API)</h2>
						<div className="errors">
							{results3.matches.length === 0 && (
								<p>No errors found!</p>
							)}
							{results3.matches.map((error, index) => (
								<div
									key={index}
									className={index % 2 === 0 ? "even" : "odd"}
								>
									{/* <p>
										<strong>Error {index + 1}: </strong>
										{error.bad}
									</p> */}
									<div>
										<p>
											<strong>
												Suggested Corrections:{" "}
											</strong>
										</p>
										<ol>
											{error.replacements.map(
												(correction, idx) => (
													<li key={idx}>
														{correction.value}
													</li>
												)
											)}
										</ol>
									</div>
									<p>
										<strong>Explanation: </strong>
										{error.message}
									</p>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</>
	);
}

export default App;

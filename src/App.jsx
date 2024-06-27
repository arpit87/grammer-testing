import { useState } from "react";
import axios from "axios";
import "./App.css";
import { Oval } from "react-loader-spinner";

function App() {
	const [text, setText] = useState("");
	const [fetched, setFetched] = useState(false);
	const [trinka, setTrinka] = useState({});
	const [textgears, setTextgears] = useState({});
	const [languagetool, setLanguagetool] = useState({});
	const [gramformer, setGramformer] = useState({});
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setFetched(false);
		console.log(text);
		try {
			const res = await axios.post(
				"https://staging.grammar-check.vani.coach/api/v1/check-text",
				{
					text: text,
				}
			);
			setTrinka(res.data.trinka);
			setTextgears(res.data.textgears);
			setLanguagetool(res.data.languagetool);
			setGramformer(res.data.gramformer);
			setFetched(true);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
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
					<button className="btn" type="submit">
						Submit
						{loading ? (
							<Oval color="#fff" height={20} width={20} />
						) : (
							""
						)}
					</button>
				</div>
			</form>
			<br />
			{fetched && (
				<div className="results">
					{trinka?.status && (
						<div>
							<h2>Results (Trinka API)</h2>
							<div className="errors">
								{trinka.response.length === 0 && (
									<p>No errors found!</p>
								)}
								{trinka.response.map((error, index) => (
									<div
										key={index}
										className={
											index % 2 === 0 ? "even" : "odd"
										}
									>
										<p>
											<strong>
												Sentence {index + 1}:{" "}
											</strong>
											{error.sentence}
										</p>
										{error.sentence_result.map(
											(result, idx) => (
												<div
													key={idx}
													style={{
														paddingLeft: "15px",
													}}
												>
													<p>
														<strong>
															Wrong Part {idx + 1}
															:{" "}
														</strong>
														{result.covered_text}
													</p>
													{result.output.map(
														(output, i) => (
															<div
																key={i}
																style={{
																	paddingLeft:
																		"15px",
																}}
															>
																<p>
																	<strong>
																		Suggested
																		Corrections{" "}
																		{i + 1}:{" "}
																	</strong>
																	{
																		output.revised_text
																	}
																</p>
																<p>
																	<strong>
																		Comment:{" "}
																	</strong>
																	{
																		output.comment
																	}
																</p>
															</div>
														)
													)}
												</div>
											)
										)}
									</div>
								))}
							</div>
						</div>
					)}
					{textgears?.status && (
						<div>
							<h2>Results (TextGears API)</h2>
							<div className="errors">
								{textgears.response.errors.length === 0 && (
									<p>No errors found!</p>
								)}
								{textgears.response.errors.map(
									(error, index) => (
										<div
											key={error.id}
											className={
												index % 2 === 0 ? "even" : "odd"
											}
										>
											<p>
												<strong>
													Error {index + 1}:{" "}
												</strong>
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
									)
								)}
							</div>
						</div>
					)}
					{languagetool?.matches && (
						<div>
							<h2>Results (LanguageTool API)</h2>
							<div className="errors">
								{languagetool.matches.length === 0 && (
									<p>No errors found!</p>
								)}
								{languagetool.matches.map((error, index) => (
									<div
										key={index}
										className={
											index % 2 === 0 ? "even" : "odd"
										}
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
					{gramformer[0] && (
						<div>
							<h2>Results (Gramformer API)</h2>
							<div className="errors">
								{gramformer[0]?.edits.length === 0 && (
									<p>No errors found!</p>
								)}
								{gramformer[0]?.edits.length && (
									<div>
										<p>
											<strong>Corrected Text: </strong>
											{gramformer[0].corrected}
										</p>
										{gramformer[0].edits.map(
											(edit, idx) => (
												<div
													key={idx}
													className={
														idx % 2 === 0
															? "even"
															: "odd"
													}
												>
													<p>
														<strong>
															Error Type:{" "}
														</strong>
														{edit[0]}
													</p>
													<p>
														<strong>Error: </strong>
														{edit[1]}{" "}
														<strong>
															&nbsp; At:{" "}
														</strong>
														{edit[2] +
															", " +
															edit[3] +
															" word position"}
													</p>
													<p>
														<strong>
															Correction:{" "}
														</strong>
														{edit[4]}{" "}
														<strong>
															&nbsp; At:{" "}
														</strong>
														{edit[5] +
															", " +
															edit[6] +
															" word position"}
													</p>
												</div>
											)
										)}
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			)}
		</>
	);
}

export default App;

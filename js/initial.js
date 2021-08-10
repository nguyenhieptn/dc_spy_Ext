class Initial{
	build(){
		let template = document.createElement("div");
		template.classList.add("exp-template");
		let input = document.createElement("input");
		input.type = "number";
		input.name = "campaign_id";
		input.placeholder = "Campaign ID";
		input.classList.add("exp-input");
		template.appendChild(input);
		let button = document.createElement("button");
		button.classList.add("exp-btn-push");
		button.classList.add("exp-btn");
		button.innerText = "Push Data";
		template.appendChild(button);
		document.body.appendChild(template);
	}
	push(products)
	{
		let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
		if(campaign_id.length === 0){
			expToast("error","Please input campaign ID!");
			return;
		}
		chrome.runtime.sendMessage({
			action: 'xhttp',
			method: 'POST',
			url: DataCenter + "/api/campaigns/products",
			headers: {
				token:token
			},
			data:JSON.stringify({
				products:products,
				campaign_id:campaign_id
			})
		}, function(responseText) {
			let data = JSON.parse(responseText);
			if (data.status === "succeed") {
				expToast("success", "Push Successfully!");
			} else {
				expToast("error", data.msg);
			}
			document.querySelector("button.exp-btn-push").classList.remove("is-loading");
		});
	}
}

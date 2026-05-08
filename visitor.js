async function countVisitor() {
  try {
    const file = await fetch("counter.json");
    const data = await file.json();

    let count = data.count + 1;

    document.getElementById("visitor-count").innerText =
      "أنت الزائر رقم: " + count;

  } catch (error) {
    console.error(error);
  }
}

countVisitor();
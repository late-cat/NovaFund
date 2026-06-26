.PHONY: evaluate check-frontend check-contracts

# Run the strict evaluation for the entire project
evaluate: check-frontend check-contracts
	@echo "✅ All strict evaluation checks passed successfully!"

# Frontend strict checks
check-frontend:
	@echo "Running Frontend Linter..."
	npm run lint
	@echo "Running Frontend Build..."
	npm run build
	@echo "Frontend checks passed!"

# Smart Contract strict checks
check-contracts:
	@echo "Running Smart Contract Formatting Check..."
	cd contracts && cargo fmt --all --check
	@echo "Running Smart Contract Strict Linter (Clippy)..."
	cd contracts && cargo clippy --all-targets --all-features -- -D warnings
	@echo "Running Smart Contract Tests..."
	cd contracts && cargo test
	@echo "Verifying Smart Contract Build..."
	cd contracts && cargo build --target wasm32-unknown-unknown --release
	@echo "Smart Contract checks passed!"

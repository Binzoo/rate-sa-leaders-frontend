import Layout from "../components/Layout";

export default function About() {
  return (
    <Layout>
      <section className="text-slate-800 min-h-screen px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              About RateSA 🇿🇦
            </h1>
            <p className="text-lg md:text-xl text-white mb-6">
              South Africa's First Independent Platform for Citizen Feedback on
              Political Leaders
            </p>
            <p className="text-lg text-white mb-12">
              Where citizens come together to voice their truth — one vote at a
              time.
            </p>
          </div>

          <div className="space-y-10 text-left bg-white/10 backdrop-blur-sm p-8 rounded-xl mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">Who We Are</h2>
            <p className="text-white">
              RateSA emerged from meaningful discussions about democratic
              participation in our beloved country. We asked: What if South
              African citizens could freely and anonymously evaluate their
              elected representatives? That question inspired this platform.
              We're an independent, non-partisan initiative empowering citizens
              to share their perspectives on political leaders based on
              performance, integrity, accountability, and public service. We
              believe South Africa's democracy flourishes when people's voices
              are heard beyond just election day.
            </p>
          </div>

          <div className="space-y-10 text-left">
            <div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-2">
                Our Mission
              </h2>
              <p className="text-white">
                RateSA is a platform built for the people of South Africa. Our
                goal is to make political accountability more accessible by
                giving citizens a simple way to rate and review their leaders.
                We aim to foster civic participation, promote transparency, and
                encourage constructive dialogue about governance in our rainbow
                nation.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-blue-600 mb-2">
                Why We Exist
              </h2>
              <p className="text-white">
                Too often, public voices are ignored between elections. RateSA
                empowers everyday South Africans to express their opinions and
                help shape the conversation on leadership and governance. By
                creating a space for citizen feedback, we hope to strengthen our
                democratic institutions and build a more responsive political
                culture.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">
                Community First
              </h2>
              <p className="text-white">
                We believe in freedom of expression, respect, and constructive
                critique. This is your space to speak up, uplift, or call out —
                respectfully and honestly. Our platform reflects South Africa's
                diverse perspectives and celebrates our constitutional right to
                freedom of expression.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Safe & Anonymous
              </h2>
              <p className="text-white">
                Your identity is protected. No account is needed to upvote or
                downvote. We are here to amplify your voice, not track it. We
                prioritize your privacy and security, creating a safe
                environment for honest political discourse.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-green-400 mb-2">
                We Are Independent
              </h2>
              <p className="text-white">
                Let us be clear: RateSA is completely independent. We are not
                funded by, affiliated with, or influenced by any political
                party, leader, or organization. Our sole commitment is to the
                South African people and strengthening our democratic processes
                through public engagement.
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl text-left">
            <h2 className="text-xl font-bold text-white mb-4">Disclaimer</h2>
            <ul className="list-disc pl-5 text-white space-y-2 text-sm">
              <li>
                The content on this website reflects public opinion. Ratings and
                reviews represent individual user views, not those of RateSA.
              </li>
              <li>
                We do not endorse or promote any political candidate, party, or
                ideology.
              </li>
              <li>
                Our platform exists solely for educational, informational, and
                civic engagement purposes.
              </li>
              <li>
                All politician images displayed on this site are freely
                available on the internet and public domains. We do not claim
                ownership of these images and use them purely for identification
                purposes.
              </li>
              <li>
                Images are sourced from publicly accessible platforms such as
                government websites, official social media accounts, and news
                outlets for informational purposes only, with no implied
                ownership or endorsement.
              </li>
              <li>
                This platform operates in accordance with Section 16 of the
                South African Constitution, exercising the right to freedom of
                expression, subject to reasonable limitations prescribed by law.
              </li>
            </ul>
            <p className="text-sm text-white/80 mt-4 text-center">
              © 2025 RateSA. All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
